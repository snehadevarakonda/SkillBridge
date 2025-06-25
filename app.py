from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, 
    template_folder='../frontend/html',
    static_folder='../frontend'
)

# Enable CORS
CORS(app)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillbridge.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # student, company, university
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    university = db.Column(db.String(100))
    major = db.Column(db.String(100))
    avatar = db.Column(db.String(200))
    resume = db.Column(db.String(200))
    linkedin = db.Column(db.String(200))

class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    industry = db.Column(db.String(50))
    size = db.Column(db.String(50))
    logo = db.Column(db.String(200))

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/companies')
def companies():
    companies_list = Company.query.all()
    return render_template('company.html', companies=companies_list)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

# API Routes
@app.route('/api/auth/register', methods=['POST'])
def register_user():
    try:
        data = request.form
        print("Received registration data:", data)
        
        # Create new user
        new_user = User(
            username=data['name'],
            email=data['email'],
            password=data['password'],  # Note: In production, hash the password
            role=data['role']
        )
        db.session.add(new_user)
        db.session.flush()  # Get the user ID without committing
        
        # Handle role-specific data
        if data['role'] == 'student':
            new_student = Student(
                user_id=new_user.id,
                university=data.get('studentInfo[university]'),
                major=data.get('studentInfo[major]'),
                avatar=data.get('studentInfo[avatar]'),
                linkedin=data.get('studentInfo[linkedin]')
            )
            db.session.add(new_student)
            
            # Handle resume file if uploaded
            if 'studentInfo[resume]' in request.files:
                resume_file = request.files['studentInfo[resume]']
                if resume_file:
                    filename = f"resume_{new_user.id}.pdf"
                    resume_file.save(f"frontend/files/{filename}")
                    new_student.resume = filename
        
        elif data['role'] == 'company':
            new_company = Company(
                user_id=new_user.id,
                name=data.get('companyInfo[companyName]'),
                industry=data.get('companyInfo[industry]')
            )
            db.session.add(new_company)
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Registration successful',
            'data': {
                'user': {
                    'id': new_user.id,
                    'name': new_user.username,
                    'email': new_user.email,
                    'role': new_user.role
                },
                'token': 'dummy-token'  # In production, generate a real JWT token
            }
        }), 201
        
    except Exception as e:
        print("Registration error:", str(e))
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/api/companies', methods=['GET'])
def get_companies():
    companies_list = Company.query.all()
    return jsonify([{
        'id': company.id,
        'name': company.name,
        'description': company.description,
        'industry': company.industry,
        'size': company.size,
        'logo': company.logo
    } for company in companies_list])

# Create initial database
def init_db():
    with app.app_context():
        db.create_all()
        
        # Add sample companies if none exist
        if Company.query.count() == 0:
            sample_companies = [
                Company(
                    name='Tech Innovators',
                    description='Leading technology solutions provider',
                    industry='Technology',
                    size='Large',
                    logo='../images/companies/tech-innovators.svg'
                ),
                Company(
                    name='Creative Solutions',
                    description='Digital creative agency',
                    industry='Design',
                    size='Medium',
                    logo='../images/companies/creative-solutions.svg'
                ),
            ]
            for company in sample_companies:
                db.session.add(company)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=3001) 
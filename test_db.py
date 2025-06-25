from app import app, db, User, Company

def test_database():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Test adding a user
        test_user = User(username='testuser', email='test@example.com')
        db.session.add(test_user)
        
        # Test adding a company
        test_company = Company(
            name='Test Company',
            description='A test company',
            industry='Technology',
            size='Small',
            logo='test-logo.png'
        )
        db.session.add(test_company)
        
        try:
            db.session.commit()
            print("✅ Database test successful!")
            print("Added test user and company to the database.")
            
            # Verify the data was added
            users = User.query.all()
            companies = Company.query.all()
            print(f"\nFound {len(users)} users and {len(companies)} companies in the database.")
            
        except Exception as e:
            print("❌ Database test failed!")
            print(f"Error: {str(e)}")
            db.session.rollback()

if __name__ == '__main__':
    test_database() 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'company', 'university'],
        required: [true, 'Role is required']
    },
    // Role-specific fields
    studentInfo: {
        university: {
            type: String,
            required: function() { return this.role === 'student'; }
        },
        major: {
            type: String,
            required: function() { return this.role === 'student'; }
        }
    },
    companyInfo: {
        companyName: {
            type: String,
            required: function() { return this.role === 'company'; }
        },
        industry: {
            type: String,
            required: function() { return this.role === 'company'; }
        }
    },
    universityInfo: {
        institutionName: {
            type: String,
            required: function() { return this.role === 'university'; }
        },
        location: {
            type: String,
            required: function() { return this.role === 'university'; }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
// Sample data (replace with database queries later)
const categories = [
    { id: 1, name: 'Logo Design', icon: '🎨' },
    { id: 2, name: 'Web Development', icon: '💻' },
    { id: 3, name: 'Content Writing', icon: '✍️' },
    { id: 4, name: 'Mobile Apps', icon: '📱' },
    { id: 5, name: 'Data Analysis', icon: '📊' },
    { id: 6, name: 'Video Editing', icon: '🎬' },
    { id: 7, name: 'Voice Over', icon: '🔊' },
    { id: 8, name: 'Cybersecurity', icon: '🔒' }
];

const companies = [
    { id: 1, name: 'Tech Innovators', logo: '/images/companies/tech-innovators.svg' },
    { id: 2, name: 'Green Energy', logo: '/images/companies/green-energy.svg' },
    { id: 3, name: 'HealthCare Plus', logo: '/images/companies/healthcare-plus.svg' },
    { id: 4, name: 'EduTech', logo: '/images/companies/edutech.svg' },
    { id: 5, name: 'FinTech', logo: '/images/companies/fintech.svg' }
];

const howItWorks = [
    {
        step: 1,
        title: 'Post your project',
        description: 'Tell us what you need. It\'s free and easy to post a project.'
    },
    {
        step: 2,
        title: 'Choose freelancers',
        description: 'Browse profiles, reviews, and proposals. Pick your favorite expert.'
    },
    {
        step: 3,
        title: 'Get it done',
        description: 'Chat, collaborate, and get your project completed securely.'
    }
];

const features = [
    {
        icon: '✔️',
        title: 'Quality Talent',
        description: 'Hand-vetted freelancers and students for every skill set.'
    },
    {
        icon: '🔒',
        title: 'Secure Payments',
        description: 'Pay only when you\'re satisfied with the work delivered.'
    },
    {
        icon: '💬',
        title: '24/7 Support',
        description: 'Our team is here to help you anytime, anywhere.'
    }
];

// Controller methods
exports.getHomePage = (req, res) => {
    res.sendFile('index.html', { root: './frontend/html' });
};

exports.searchServices = (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({
            status: 'error',
            message: 'Search query is required'
        });
    }

    // In a real application, this would query a database
    const results = categories.filter(category => 
        category.name.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
        status: 'success',
        data: results
    });
};

exports.getCategories = (req, res) => {
    res.json({
        status: 'success',
        data: categories
    });
};

exports.getTrustedCompanies = (req, res) => {
    res.json({
        status: 'success',
        data: companies
    });
};

exports.getHowItWorks = (req, res) => {
    res.json({
        status: 'success',
        data: howItWorks
    });
};

exports.getFeatures = (req, res) => {
    res.json({
        status: 'success',
        data: features
    });
}; 
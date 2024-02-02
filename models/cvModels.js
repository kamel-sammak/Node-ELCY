const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId },
    Engineering: {
        type: String,
        required: [false, "please enter user Engineering !"],
        enum: ['informationEngineering', 'architecture', 'civil', 'medical']
    },
    Skills: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                const engineeringDivision = this.Engineering;
                const validOptions = {
                    informationEngineering: [
                        'font-end', 'backend', 'flutter', 'nodejs', 'viewjs', 'AI',
                        'laravel', 'asp.net', 'django', 'go', 'rube', 'machine learning',
                        'deep learning', 'java', 'c#', 'c', 'c++', 'network', 'neural network',
                        'software', 'search engine', 'web desgin', 'web development', 'UI',
                        'oop', 'information security', 'data Analysis', 'Mobile app development'
                    ],
                    civil: [
                        'Structural Engineering', 'Aotucade', '3D Max',
                        'Roads and bridges engineering (Transportation Engineering)',
                        'Water Resources Engineering', 'Construction Management Engineering',
                        'Engineering Design', 'Engineering Inspection', 'Engineering Project Management',
                        'Engineering Quality', 'Structural Analysis', 'Infrastructure',
                        'Architectural Design', 'Excavation and Excavating', 'Cost Estimation'
                    ],
                    architecture: [
                        'Architectural Design', 'Urban Planning', 'Architectural Facade',
                        'Interior Design', 'Architectural Plans', 'Sustainable Design',
                        'Landscape Design', 'Structural Design', 'Lighting Design',
                        'Open Design', 'Glass Facade Design', 'Architectural Integration'
                    ],
                    medical: [
                        'Medical imaging devices', 'Digital Medical Imaging Techniques',
                        'Vital Signs Monitoring Devices', 'Intensive Care Unit Devices',
                        'Surgical Robots', 'Cardiovascular Devices', 'Telemedicine Technologies',
                        'Pain Management Devices', 'Biomechanical Design', 'Organ Regeneration Technologies',
                        'Artificial limbs', 'Medical Device Manufacturing'
                    ]
                };

                return !value || (validOptions[engineeringDivision] && validOptions[engineeringDivision].includes(value));
            },
            message: 'Invalid Skills for the selected engineering division, please choose from the specified options'
        }
    }
});

const Cv = mongoose.model('Cv', cvSchema);
module.exports = Cv;
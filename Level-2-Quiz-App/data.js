const quizDomains = [
    {
        id: "web-dev",
        title: "Web Development",
        icon: "🌐",
        description: "HTML, CSS, JS Fundamentals",
        questions: [
            {
                text: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Multi Language"],
                correctAnswer: 0
            },
            {
                text: "Which property is used to change the background color in CSS?",
                options: ["color", "bgcolor", "background-color", "bg-color"],
                correctAnswer: 2
            },
            {
                text: "How do you select an element with id 'demo' in JavaScript?",
                options: ["document.getElementById('demo')", "document.querySelector('#demo')", "Both A and B", "None of the above"],
                correctAnswer: 2
            },
            {
                text: "Which of the following is not a CSS framework?",
                options: ["Bootstrap", "Tailwind CSS", "React", "Bulma"],
                correctAnswer: 2
            },
            {
                text: "What is the correct syntax for referring to an external script called 'app.js'?",
                options: ["<script href='app.js'>", "<script source='app.js'>", "<script src='app.js'>", "<script file='app.js'>"],
                correctAnswer: 2
            }
        ]
    },
    {
        id: "app-dev",
        title: "App Development",
        icon: "📱",
        description: "Mobile App Concepts",
        questions: [
            {
                text: "Which language is used for Android native development?",
                options: ["Swift", "Java/Kotlin", "Objective-C", "C#"],
                correctAnswer: 1
            },
            {
                text: "What does API stand for?",
                options: ["Application Programming Interface", "Advanced Programming Integration", "App Policy Interface", "Application Protocol Interface"],
                correctAnswer: 0
            },
            {
                text: "Which framework is used to build cross-platform apps using Dart?",
                options: ["React Native", "Flutter", "Xamarin", "Ionic"],
                correctAnswer: 1
            },
            {
                text: "What does SDK stand for?",
                options: ["Software Development Kit", "System Design Kit", "Software Data Kit", "System Development Kit"],
                correctAnswer: 0
            },
            {
                text: "Which state management tool is commonly used in React Native?",
                options: ["Redux", "Vuex", "Provider", "Bloc"],
                correctAnswer: 0
            }
        ]
    },
    {
        id: "data-analytics",
        title: "Data Analytics",
        icon: "📊",
        description: "Analyzing Data Sets",
        questions: [
            {
                text: "Which language is most popular for data analytics?",
                options: ["Python", "Java", "C++", "JavaScript"],
                correctAnswer: 0
            },
            {
                text: "What is a primary key in a database?",
                options: ["A key used to encrypt data", "A unique identifier for a record", "A key to unlock the database", "The first column in a table"],
                correctAnswer: 1
            },
            {
                text: "What does SQL stand for?",
                options: ["Simple Query Language", "Structured Query Language", "System Query Language", "Standard Query Language"],
                correctAnswer: 1
            },
            {
                text: "Which tool is used for data visualization?",
                options: ["MongoDB", "Tableau", "Express", "Node.js"],
                correctAnswer: 1
            },
            {
                text: "What is a DataFrame in Pandas?",
                options: ["A 1D array", "A 2D labeled data structure", "A 3D matrix", "A mathematical function"],
                correctAnswer: 1
            }
        ]
    },
    {
        id: "data-scientist",
        title: "Data Scientist",
        icon: "🧠",
        description: "Machine Learning & AI",
        questions: [
            {
                text: "What is the goal of supervised learning?",
                options: ["To find hidden structures in unlabeled data", "To learn a function that maps an input to an output based on example input-output pairs", "To group similar data points", "To reduce the dimensionality of data"],
                correctAnswer: 1
            },
            {
                text: "Which library is commonly used for deep learning?",
                options: ["Scikit-learn", "Matplotlib", "TensorFlow", "Pandas"],
                correctAnswer: 2
            },
            {
                text: "What is overfitting in Machine Learning?",
                options: ["When the model performs poorly on training data", "When the model learns the training data too well, including noise", "When the model is too simple", "When the model trains too fast"],
                correctAnswer: 1
            },
            {
                text: "Which metric is used for classification problems?",
                options: ["Mean Squared Error (MSE)", "R-squared", "Accuracy", "Root Mean Squared Error (RMSE)"],
                correctAnswer: 2
            },
            {
                text: "What does NLP stand for?",
                options: ["Natural Language Processing", "Neural Logic Programming", "Network Learning Protocol", "Number Linear Programming"],
                correctAnswer: 0
            }
        ]
    },
    {
        id: "java",
        title: "Java",
        icon: "☕",
        description: "Core Java Concepts",
        questions: [
            {
                text: "What is the size of int variable in Java?",
                options: ["8 bit", "16 bit", "32 bit", "64 bit"],
                correctAnswer: 2
            },
            {
                text: "Which of these are selection statements in Java?",
                options: ["break", "continue", "for()", "if()"],
                correctAnswer: 3
            },
            {
                text: "What is the entry point of a Java program?",
                options: ["start()", "main()", "run()", "init()"],
                correctAnswer: 1
            },
            {
                text: "Which principle of OOP describes data hiding?",
                options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
                correctAnswer: 2
            },
            {
                text: "Which of the following is not a Java keyword?",
                options: ["static", "Boolean", "void", "private"],
                correctAnswer: 1
            }
        ]
    },
    {
        id: "bde",
        title: "Business Dev (BDE)",
        icon: "💼",
        description: "Business & Sales",
        questions: [
            {
                text: "What does B2B stand for?",
                options: ["Business to Bank", "Business to Business", "Buyer to Buyer", "Brand to Brand"],
                correctAnswer: 1
            },
            {
                text: "What is a 'Cold Call'?",
                options: ["Calling a customer in winter", "Following up with an existing customer", "Calling a prospect who has not expressed prior interest", "A dropped call"],
                correctAnswer: 2
            },
            {
                text: "What does CRM stand for?",
                options: ["Customer Relationship Management", "Company Resource Management", "Client Retention Model", "Customer Revenue Maximization"],
                correctAnswer: 0
            },
            {
                text: "Which is a key phase in the sales funnel?",
                options: ["Manufacturing", "Awareness", "Distribution", "Debugging"],
                correctAnswer: 1
            },
            {
                text: "What is ROI?",
                options: ["Return on Investment", "Rate of Interest", "Risk of Inflation", "Revenue over Income"],
                correctAnswer: 0
            }
        ]
    }
];

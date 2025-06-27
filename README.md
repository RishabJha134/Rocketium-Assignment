# Canvas Builder API with PDF Export

A full-stack MERN application that allows users to create canvases, add visual elements, and export them as PDF files.

## 🚀 Features

- **Canvas Creation**: Initialize canvas with custom dimensions
- **Element Addition**: Add rectangles, circles, text, and images
- **Real-time Preview**: Live canvas preview in the browser
- **PDF Export**: Export canvas as optimized PDF file
- **Responsive UI**: Modern React interface with Vite

## 🛠️ Technology Stack

### Frontend
- **React 18** with **Vite** for fast development
- **HTML5 Canvas API** for canvas manipulation
- **Axios** for API communication
- **CSS3** for styling

### Backend
- **Node.js** with **Express.js**
- **Canvas** library for server-side canvas manipulation
- **PDFKit** for PDF generation
- **Multer** for file uploads
- **CORS** for cross-origin requests

## 📁 Project Structure

```
canvas-builder/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Custom middleware
│   ├── uploads/           # Uploaded images
│   ├── exports/           # Generated PDFs
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd canvas-builder
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Start the Development Servers**

Backend (Port 5000):
```bash
cd backend
npm run dev
```

Frontend (Port 3000):
```bash
cd frontend
npm run dev
```

## 📚 API Documentation

### Initialize Canvas
```
POST /api/canvas/initialize
Body: { width: number, height: number }
```

### Add Rectangle
```
POST /api/canvas/add-rectangle
Body: { x, y, width, height, color }
```

### Add Circle
```
POST /api/canvas/add-circle
Body: { x, y, radius, color }
```

### Add Text
```
POST /api/canvas/add-text
Body: { x, y, text, fontSize, color }
```

### Add Image
```
POST /api/canvas/add-image
Body: FormData with image file and position
```

### Export PDF
```
GET /api/canvas/export-pdf
Response: PDF file download
```

## 🌐 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on OnRender (Serverless Functions)

## 👨‍💻 Developer

Created for Rocketium Full Stack Internship Assignment

## 📄 License

MIT License

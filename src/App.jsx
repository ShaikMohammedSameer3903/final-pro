import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ThreeBackground from './components/ThreeBackground.jsx'
import Home from './pages/Home.jsx'
import Tools from './pages/Tools.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

import PageTransition from './components/PageTransition.jsx'
import Loader from './components/Loader.jsx'

const ResumeBuilder = lazy(() => import('./tools/ResumeBuilder/ResumeBuilder.jsx'))
const PdfCompressor = lazy(() => import('./tools/PdfCompressor.jsx'))
const PdfMerger = lazy(() => import('./tools/PdfMerger.jsx'))
const NotesToPdf = lazy(() => import('./tools/NotesToPdf.jsx'))
const CgpaCalculator = lazy(() => import('./tools/CgpaCalculator.jsx'))
const PomodoroTimer = lazy(() => import('./tools/PomodoroTimer.jsx'))
const PasswordGenerator = lazy(() => import('./tools/PasswordGenerator.jsx'))

const ImageCompressor = lazy(() => import('./tools/ImageCompressor.jsx'))
const ImageConverter = lazy(() => import('./tools/ImageConverter.jsx'))
const ImageResizer = lazy(() => import('./tools/ImageResizer.jsx'))
const ImagesToPdf = lazy(() => import('./tools/ImagesToPdf.jsx'))
const PdfToImages = lazy(() => import('./tools/PdfToImages.jsx'))
const DocxToPdf = lazy(() => import('./tools/DocxToPdf.jsx'))
const VideoSummary = lazy(() => import('./tools/VideoSummary.jsx'))
const VideoToAudio = lazy(() => import('./tools/VideoToAudio.jsx'))
const YouTubeSummary = lazy(() => import('./tools/YouTubeSummary.jsx'))

export default function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <Navbar />
      <ThreeBackground />
      <main className="app-main">
        <Suspense fallback={<div className="container"><Loader label="Loading…" /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/tools" element={<PageTransition><Tools /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />

            <Route path="/tools/resume-builder" element={<PageTransition><ResumeBuilder /></PageTransition>} />

            <Route path="/tools/image-compressor" element={<PageTransition><ImageCompressor /></PageTransition>} />
            <Route path="/tools/image-converter" element={<PageTransition><ImageConverter /></PageTransition>} />
            <Route path="/tools/image-resizer" element={<PageTransition><ImageResizer /></PageTransition>} />
            <Route path="/tools/images-to-pdf" element={<PageTransition><ImagesToPdf /></PageTransition>} />

            <Route path="/tools/pdf-compressor" element={<PageTransition><PdfCompressor /></PageTransition>} />
            <Route path="/tools/pdf-merger" element={<PageTransition><PdfMerger /></PageTransition>} />
            <Route path="/tools/notes-to-pdf" element={<PageTransition><NotesToPdf /></PageTransition>} />

            <Route path="/tools/pdf-to-images" element={<PageTransition><PdfToImages /></PageTransition>} />
            <Route path="/tools/docx-to-pdf" element={<PageTransition><DocxToPdf /></PageTransition>} />

            <Route path="/tools/cgpa-calculator" element={<PageTransition><CgpaCalculator /></PageTransition>} />
            <Route path="/tools/pomodoro-timer" element={<PageTransition><PomodoroTimer /></PageTransition>} />
            <Route path="/tools/password-generator" element={<PageTransition><PasswordGenerator /></PageTransition>} />

            <Route path="/tools/video-summary" element={<PageTransition><VideoSummary /></PageTransition>} />
            <Route path="/tools/video-to-audio" element={<PageTransition><VideoToAudio /></PageTransition>} />
            <Route path="/tools/youtube-summary" element={<PageTransition><YouTubeSummary /></PageTransition>} />

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

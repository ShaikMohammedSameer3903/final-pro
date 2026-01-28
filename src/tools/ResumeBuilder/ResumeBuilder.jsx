import { useEffect, useMemo, useRef, useState } from 'react'
import html2pdf from 'html2pdf.js'
import { Reorder } from 'framer-motion'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import ResumeForm from './ResumeForm.jsx'
import ResumePreview from './ResumePreview.jsx'
import LatexClassic from './templates/LatexClassic.jsx'
import LatexModern from './templates/LatexModern.jsx'
import LatexAcademic from './templates/LatexAcademic.jsx'
import OneColumnMinimal from './templates/OneColumnMinimal.jsx'
import TwoColumnProfessional from './templates/TwoColumnProfessional.jsx'
import { STORAGE_KEYS } from '../../utils/constants.js'
import { loadJson, saveJson } from '../../utils/storage.js'

const emptyDraft = {
  personal: {
    name: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    website: '',
  },
  education: [
    {
      institution: '',
      degree: '',
      location: '',
      date: '',
      details: '',
    },
  ],
  experience: [
    {
      title: '',
      company: '',
      location: '',
      date: '',
      details: '',
    },
  ],
  projects: [
    {
      name: '',
      link: '',
      date: '',
      details: '',
    },
  ],
  skills: [
    {
      category: 'Programming Languages',
      items: [],
    },
  ],
  certifications: [
    {
      name: '',
      issuer: '',
      year: '',
    },
  ],
  publications: [
    {
      title: '',
      authors: '',
      venue: '',
      year: '',
    },
  ],
  sectionsEnabled: {
    education: true,
    experience: true,
    projects: true,
    skills: true,
    certifications: true,
    publications: true,
  },
  sectionOrder: ['education', 'experience', 'projects', 'publications', 'skills', 'certifications'],
  settings: {
    font: 'sans',
    spacing: 'compact',
    primaryColor: '#004f90',
    printMarginMm: 8,
    previewScale: 1,
  },
}

function normalizeDraft(d) {
  const base = d && typeof d === 'object' ? d : emptyDraft

  const personal = base.personal && typeof base.personal === 'object' ? base.personal : {}
  const legacyPersonal = base.personal && typeof base.personal === 'object' ? base.personal : {}

  const migratedPersonal = {
    ...emptyDraft.personal,
    ...personal,
  }

  if (!migratedPersonal.name && (legacyPersonal.fullName || legacyPersonal.title)) {
    migratedPersonal.name = legacyPersonal.fullName || ''
  }

  const education = Array.isArray(base.education) && base.education.length ? base.education : emptyDraft.education
  const experience = Array.isArray(base.experience) && base.experience.length ? base.experience : emptyDraft.experience
  const projects = Array.isArray(base.projects) && base.projects.length ? base.projects : emptyDraft.projects

  const migratedEducation = education.map((e) => {
    if (e && typeof e === 'object' && ('institution' in e || 'date' in e)) return e
    const school = e?.school || ''
    const degree = e?.degree || ''
    const date = [e?.start, e?.end].filter(Boolean).join(' - ')
    return { institution: school, degree, location: '', date, details: e?.details || '' }
  })

  const migratedExperience = experience.map((e) => {
    if (e && typeof e === 'object' && ('title' in e || 'date' in e)) return e
    const title = e?.role || ''
    const company = e?.company || ''
    const date = [e?.start, e?.end].filter(Boolean).join(' - ')
    return { title, company, location: '', date, details: e?.details || '' }
  })

  const migratedProjects = projects.map((p) => {
    if (p && typeof p === 'object' && ('date' in p)) return p
    return { name: p?.name || '', link: p?.link || '', date: '', details: p?.details || '' }
  })

  let skills = Array.isArray(base.skills) ? base.skills : emptyDraft.skills
  if (skills.length && typeof skills[0] === 'string') {
    skills = [{ category: 'Skills', items: skills.map((s) => String(s)).filter(Boolean) }]
  }
  if (skills.length && skills[0] && typeof skills[0] === 'object' && 'name' in skills[0]) {
    skills = [{ category: 'Skills', items: skills.map((s) => s?.name || '').filter(Boolean) }]
  }
  const migratedSkills = Array.isArray(skills) && skills.length ? skills : emptyDraft.skills

  const certifications = Array.isArray(base.certifications) && base.certifications.length ? base.certifications : emptyDraft.certifications
  const publications = Array.isArray(base.publications) && base.publications.length ? base.publications : emptyDraft.publications

  const sectionsEnabled =
    base.sectionsEnabled && typeof base.sectionsEnabled === 'object' ? { ...emptyDraft.sectionsEnabled, ...base.sectionsEnabled } : emptyDraft.sectionsEnabled

  const sectionOrder = Array.isArray(base.sectionOrder) && base.sectionOrder.length ? base.sectionOrder : emptyDraft.sectionOrder

  const settings = base.settings && typeof base.settings === 'object' ? { ...emptyDraft.settings, ...base.settings } : emptyDraft.settings

  return {
    ...emptyDraft,
    ...base,
    personal: migratedPersonal,
    education: migratedEducation,
    experience: migratedExperience,
    projects: migratedProjects,
    skills: migratedSkills,
    certifications,
    publications,
    sectionsEnabled,
    sectionOrder,
    settings,
  }
}

export default function ResumeBuilder() {
  const initial = useMemo(() => normalizeDraft(loadJson(STORAGE_KEYS.resumeDraft, emptyDraft)), [])
  const [draft, setDraft] = useState(initial)
  const [template, setTemplate] = useState('classic')
  const [mobileTab, setMobileTab] = useState('form')
  const [confirmReset, setConfirmReset] = useState(false)
  const [exporting, setExporting] = useState(false)

  const previewRef = useRef(null)

  useEffect(() => {
    saveJson(STORAGE_KEYS.resumeDraft, draft)
  }, [draft])

  const Template =
    template === 'academic'
      ? LatexAcademic
      : template === 'modern'
        ? LatexModern
        : template === 'two-column'
          ? TwoColumnProfessional
          : template === 'minimal'
            ? OneColumnMinimal
            : LatexClassic

  const sectionLabels = {
    education: 'Education',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    publications: 'Publications',
  }

  const setSectionOrder = (order) => setDraft((d) => ({ ...d, sectionOrder: order }))

  const exportPdf = async () => {
    if (!previewRef.current) return
    setExporting(true)

    try {
      const element = previewRef.current
      const opt = {
        margin: Number(draft.settings?.printMarginMm ?? 8),
        filename: `${(draft.personal.name || 'resume').trim().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      }
      await html2pdf().set(opt).from(element).save()
    } finally {
      setExporting(false)
    }
  }

  const resetDraft = () => {
    setDraft(emptyDraft)
    saveJson(STORAGE_KEYS.resumeDraft, emptyDraft)
    setConfirmReset(false)
  }

  const toggleSection = (key) => {
    setDraft((d) => ({
      ...d,
      sectionsEnabled: {
        ...d.sectionsEnabled,
        [key]: !d.sectionsEnabled?.[key],
      },
    }))
  }

  const setSetting = (patch) => setDraft((d) => ({ ...d, settings: { ...d.settings, ...patch } }))

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="h1" style={{ fontSize: 28 }}>
            Resume Builder
          </div>
          <p className="p">Fill the form, preview live, choose a template, then download as PDF.</p>
        </div>

        <div className="row">
          <span className="badge">Draft auto-saves</span>
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            Reset
          </Button>
          <Button onClick={exportPdf} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="split">
        <div className={`card resume-pane ${mobileTab === 'form' ? '' : 'mobile-hidden'}`}>
          <div className="section">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="h2" style={{ margin: 0 }}>
                Form
              </div>
              <div className="row">
                <div className="row" style={{ gap: 8 }}>
                  <Button
                    variant={mobileTab === 'form' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setMobileTab('form')}
                    type="button"
                  >
                    Edit
                  </Button>
                  <Button
                    variant={mobileTab === 'preview' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setMobileTab('preview')}
                    type="button"
                  >
                    Preview
                  </Button>
                </div>
                <span className="label" style={{ margin: 0 }}>
                  Template
                </span>
                <select className="select" value={template} onChange={(e) => setTemplate(e.target.value)}>
                  <option value="classic">LaTeX Classic</option>
                  <option value="academic">LaTeX Academic</option>
                  <option value="modern">LaTeX Modern</option>
                  <option value="two-column">Two-Column Professional</option>
                  <option value="minimal">One-Column Minimal (ATS)</option>
                </select>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
              <div className="card" style={{ boxShadow: 'none' }}>
                <div className="section" style={{ padding: 12 }}>
                  <div className="h2" style={{ margin: 0, fontSize: 16 }}>Layout</div>
                  <div style={{ height: 10 }} />
                  <label className="label">Font</label>
                  <select className="select" value={draft.settings.font} onChange={(e) => setSetting({ font: e.target.value })}>
                    <option value="sans">Sans (Corporate)</option>
                    <option value="serif">Serif (Academic)</option>
                    <option value="latexClassic">LaTeX Classic</option>
                  </select>
                  <div style={{ height: 10 }} />
                  <label className="label">Spacing</label>
                  <select className="select" value={draft.settings.spacing} onChange={(e) => setSetting({ spacing: e.target.value })}>
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="spacious">Spacious</option>
                  </select>

                  <div style={{ height: 10 }} />
                  <label className="label">Print margin (mm)</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={20}
                    value={draft.settings.printMarginMm}
                    onChange={(e) => setSetting({ printMarginMm: Number(e.target.value || 0) })}
                  />

                  <div style={{ height: 10 }} />
                  <label className="label">Preview scale ({Math.round((draft.settings.previewScale || 1) * 100)}%)</label>
                  <input
                    className="input"
                    type="range"
                    min={0.75}
                    max={1.25}
                    step={0.05}
                    value={draft.settings.previewScale || 1}
                    onChange={(e) => setSetting({ previewScale: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="card" style={{ boxShadow: 'none' }}>
                <div className="section" style={{ padding: 12 }}>
                  <div className="h2" style={{ margin: 0, fontSize: 16 }}>Sections</div>
                  <div style={{ height: 10 }} />
                  {Object.keys(sectionLabels).map((k) => (
                    <label key={k} className="row" style={{ justifyContent: 'space-between' }}>
                      <span>{sectionLabels[k]}</span>
                      <input
                        type="checkbox"
                        checked={draft.sectionsEnabled?.[k] !== false}
                        onChange={() => toggleSection(k)}
                        aria-label={`Toggle ${sectionLabels[k]}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="h2" style={{ margin: 0, fontSize: 16 }}>
                    Reorder Sections
                  </div>
                  <span className="badge">Drag</span>
                </div>
                <div style={{ height: 10 }} />
                <Reorder.Group axis="y" values={draft.sectionOrder} onReorder={setSectionOrder} className="grid" style={{ gap: 8 }}>
                  {draft.sectionOrder.map((key) => (
                    <Reorder.Item
                      key={key}
                      value={key}
                      className="card"
                      style={{ boxShadow: 'none', cursor: 'grab' }}
                    >
                      <div className="section" style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>{sectionLabels[key] || key}</div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            </div>

            <div style={{ height: 12 }} />
            <ResumeForm value={draft} onChange={(next) => setDraft(normalizeDraft(next))} />
          </div>
        </div>

        <div className={`card sticky resume-pane ${mobileTab === 'preview' ? '' : 'mobile-hidden'}`}>
          <div className="section">
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="h2" style={{ margin: 0 }}>
                Live Preview
              </div>
              <span className="badge">A4 export</span>
            </div>
            <ResumePreview>
              <div
                style={{
                  transform: `scale(${draft.settings?.previewScale || 1})`,
                  transformOrigin: 'top left',
                  width: `${100 / (draft.settings?.previewScale || 1)}%`,
                }}
              >
                <div ref={previewRef} style={{ background: 'white', color: '#111', borderRadius: 12, overflow: 'hidden' }}>
                  <Template data={draft} order={draft.sectionOrder} enabled={draft.sectionsEnabled} settings={draft.settings} />
                </div>
              </div>
            </ResumePreview>
          </div>
        </div>
      </div>

      <Modal
        open={confirmReset}
        title="Reset draft?"
        onClose={() => setConfirmReset(false)}
        footer={
          <div className="row" style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={resetDraft}>
              Reset
            </Button>
          </div>
        }
      >
        <div className="p">This will clear your saved draft from localStorage.</div>
      </Modal>
    </div>
  )
}

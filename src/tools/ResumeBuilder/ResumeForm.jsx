import Button from '../../components/Button.jsx'

function updateAt(list, index, patch) {
  return list.map((item, i) => (i === index ? { ...item, ...patch } : item))
}

function removeAt(list, index) {
  return list.filter((_, i) => i !== index)
}

function addIfNeeded(list, factory) {
  if (list.length === 0) return [factory()]
  return list
}

function splitCsv(s) {
  return String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

export default function ResumeForm({ value, onChange }) {
  const setPersonal = (patch) => onChange({ ...value, personal: { ...value.personal, ...patch } })

  const setEducation = (education) =>
    onChange({
      ...value,
      education: addIfNeeded(education, () => ({ institution: '', degree: '', location: '', date: '', details: '' })),
    })

  const setExperience = (experience) =>
    onChange({
      ...value,
      experience: addIfNeeded(experience, () => ({ title: '', company: '', location: '', date: '', details: '' })),
    })

  const setProjects = (projects) =>
    onChange({
      ...value,
      projects: addIfNeeded(projects, () => ({ name: '', link: '', date: '', details: '' })),
    })

  const setSkills = (skills) =>
    onChange({
      ...value,
      skills: addIfNeeded(skills, () => ({ category: 'Skills', items: [] })),
    })

  const setCertifications = (certifications) =>
    onChange({
      ...value,
      certifications: addIfNeeded(certifications, () => ({ name: '', issuer: '', year: '' })),
    })

  const setPublications = (publications) =>
    onChange({
      ...value,
      publications: addIfNeeded(publications, () => ({ title: '', authors: '', venue: '', year: '' })),
    })

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div>
        <div className="h2" style={{ margin: 0 }}>
          Personal
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <div>
            <label className="label">Name</label>
            <input className="input" value={value.personal.name} onChange={(e) => setPersonal({ name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={value.personal.email} onChange={(e) => setPersonal({ email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={value.personal.phone} onChange={(e) => setPersonal({ phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Website</label>
            <input className="input" value={value.personal.website} onChange={(e) => setPersonal({ website: e.target.value })} />
          </div>
          <div>
            <label className="label">LinkedIn</label>
            <input className="input" value={value.personal.linkedin} onChange={(e) => setPersonal({ linkedin: e.target.value })} />
          </div>
          <div>
            <label className="label">GitHub</label>
            <input className="input" value={value.personal.github} onChange={(e) => setPersonal({ github: e.target.value })} />
          </div>
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>
            Skills
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSkills([...(value.skills || []), { category: 'Skills', items: [] }])}
            type="button"
          >
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.skills || []).map((s, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section" style={{ padding: 12 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Group {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setSkills(removeAt(value.skills, idx))} type="button">
                    Remove
                  </Button>
                </div>
                <div style={{ height: 10 }} />
                <label className="label">Category</label>
                <input className="input" value={s.category || ''} onChange={(e) => setSkills(updateAt(value.skills, idx, { category: e.target.value }))} />
                <div style={{ height: 10 }} />
                <label className="label">Items (comma separated)</label>
                <input
                  className="input"
                  value={(s.items || []).join(', ')}
                  onChange={(e) => setSkills(updateAt(value.skills, idx, { items: splitCsv(e.target.value) }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>
            Education
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setEducation([...(value.education || []), { institution: '', degree: '', location: '', date: '', details: '' }])
            }
            type="button"
          >
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.education || []).map((ed, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Item {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setEducation(removeAt(value.education, idx))} type="button">
                    Remove
                  </Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  <div>
                    <label className="label">Institution</label>
                    <input
                      className="input"
                      value={ed.institution}
                      onChange={(e) => setEducation(updateAt(value.education, idx, { institution: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Degree</label>
                    <input
                      className="input"
                      value={ed.degree}
                      onChange={(e) => setEducation(updateAt(value.education, idx, { degree: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input
                      className="input"
                      value={ed.location}
                      onChange={(e) => setEducation(updateAt(value.education, idx, { location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input
                      className="input"
                      value={ed.date}
                      onChange={(e) => setEducation(updateAt(value.education, idx, { date: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ height: 10 }} />
                <label className="label">Details</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={ed.details}
                  onChange={(e) => setEducation(updateAt(value.education, idx, { details: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>
            Experience
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setExperience([...(value.experience || []), { title: '', company: '', location: '', date: '', details: '' }])
            }
            type="button"
          >
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.experience || []).map((ex, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Item {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setExperience(removeAt(value.experience, idx))} type="button">
                    Remove
                  </Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  <div>
                    <label className="label">Title</label>
                    <input
                      className="input"
                      value={ex.title}
                      onChange={(e) => setExperience(updateAt(value.experience, idx, { title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Company</label>
                    <input
                      className="input"
                      value={ex.company}
                      onChange={(e) => setExperience(updateAt(value.experience, idx, { company: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <input
                      className="input"
                      value={ex.location}
                      onChange={(e) => setExperience(updateAt(value.experience, idx, { location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input
                      className="input"
                      value={ex.date}
                      onChange={(e) => setExperience(updateAt(value.experience, idx, { date: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ height: 10 }} />
                <label className="label">Details</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={ex.details}
                  onChange={(e) => setExperience(updateAt(value.experience, idx, { details: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>
            Projects
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setProjects([...(value.projects || []), { name: '', link: '', date: '', details: '' }])}
            type="button"
          >
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.projects || []).map((p, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Item {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setProjects(removeAt(value.projects, idx))} type="button">
                    Remove
                  </Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  <div>
                    <label className="label">Name</label>
                    <input
                      className="input"
                      value={p.name}
                      onChange={(e) => setProjects(updateAt(value.projects, idx, { name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Link</label>
                    <input
                      className="input"
                      value={p.link}
                      onChange={(e) => setProjects(updateAt(value.projects, idx, { link: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input
                      className="input"
                      value={p.date}
                      onChange={(e) => setProjects(updateAt(value.projects, idx, { date: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ height: 10 }} />
                <label className="label">Details</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={p.details}
                  onChange={(e) => setProjects(updateAt(value.projects, idx, { details: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>Certifications</div>
          <Button variant="secondary" size="sm" onClick={() => setCertifications([...(value.certifications || []), { name: '', issuer: '', year: '' }])} type="button">
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.certifications || []).map((c, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Item {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setCertifications(removeAt(value.certifications, idx))} type="button">Remove</Button>
                </div>
                <div style={{ height: 10 }} />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  <div>
                    <label className="label">Name</label>
                    <input className="input" value={c.name} onChange={(e) => setCertifications(updateAt(value.certifications, idx, { name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Issuer</label>
                    <input className="input" value={c.issuer} onChange={(e) => setCertifications(updateAt(value.certifications, idx, { issuer: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Year</label>
                    <input className="input" value={c.year} onChange={(e) => setCertifications(updateAt(value.certifications, idx, { year: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="h2" style={{ margin: 0 }}>Publications</div>
          <Button variant="secondary" size="sm" onClick={() => setPublications([...(value.publications || []), { title: '', authors: '', venue: '', year: '' }])} type="button">
            Add
          </Button>
        </div>
        <div style={{ height: 10 }} />
        <div className="grid" style={{ gap: 12 }}>
          {(value.publications || []).map((p, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none' }}>
              <div className="section">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="badge">Item {idx + 1}</div>
                  <Button variant="ghost" size="sm" onClick={() => setPublications(removeAt(value.publications, idx))} type="button">Remove</Button>
                </div>
                <div style={{ height: 10 }} />
                <label className="label">Title</label>
                <input className="input" value={p.title} onChange={(e) => setPublications(updateAt(value.publications, idx, { title: e.target.value }))} />
                <div style={{ height: 10 }} />
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  <div>
                    <label className="label">Authors</label>
                    <input className="input" value={p.authors} onChange={(e) => setPublications(updateAt(value.publications, idx, { authors: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Venue</label>
                    <input className="input" value={p.venue} onChange={(e) => setPublications(updateAt(value.publications, idx, { venue: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Year</label>
                    <input className="input" value={p.year} onChange={(e) => setPublications(updateAt(value.publications, idx, { year: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

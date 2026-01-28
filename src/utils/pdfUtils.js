import { PDFDocument } from 'pdf-lib'

export async function mergePdfs(files) {
  const merged = await PDFDocument.create()

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const doc = await PDFDocument.load(bytes)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach((p) => merged.addPage(p))
  }

  const mergedBytes = await merged.save({ useObjectStreams: true })
  return new Blob([mergedBytes], { type: 'application/pdf' })
}

export async function bestEffortCompressPdf(file) {
  const bytes = await file.arrayBuffer()
  const doc = await PDFDocument.load(bytes)
  const out = await doc.save({ useObjectStreams: true })
  return new Blob([out], { type: 'application/pdf' })
}

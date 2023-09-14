module.exports = class Printer {
  static header (title) {
    console.log(`┌─ ${title}`)
  }

  static subHeader (title) {
    console.log(`│  ┌─ ${title}`)
  }

  static instruction (instruction) {
    console.log(`│  │  ${instruction}`)
  }

  static instructionHeader (instruction) {
    console.log(`│  │• ${instruction}`)
  }

  static instructionFooter () {
    console.log(`│  └─────────────────────────────`)
  }

  static footer () {
    console.log(`└───────────────────────────────────`)
  }
}

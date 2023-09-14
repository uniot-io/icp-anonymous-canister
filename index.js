const express = require('express')
const cors = require('cors')
const dns = require('dns')
const https = require('https')
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const { Principal } = require('@dfinity/principal')
const Printer = require('./printer')

const principal = Principal.anonymous().toString()
const domain = `${principal}.icp0.io`
const certPath = path.join(__dirname, `${principal}.pem`)
const keyPath = path.join(__dirname, `${principal}-key.pem`)

const app = express()
app.use(cors())
app.use(express.static('./static'))

function mkcertInstalled () {
  try {
    execSync('which mkcert')
    return true
  } catch (_) {
    return false
  }
}

function certsExist () {
  return fs.existsSync(certPath) && fs.existsSync(keyPath)
}

function generateCerts () {
  console.log('Generating certificates...')
  execSync('mkcert -install')
  execSync(`mkcert -cert-file ${principal}.pem -key-file ${principal}-key.pem ${domain}`)
}

async function isDomainLocallyConfigured (hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err, address) => {
      if (err) {
        return resolve(false)
      }
      resolve(address === '127.0.0.1')
    })
  })
}

function main () {
  if (!mkcertInstalled()) {
    Printer.header('[ERROR] `mkcert` not installed')
    Printer.subHeader('Please install `mkcert` first.')
    Printer.instruction('Visit the `mkcert` GitHub repository:')
    Printer.instruction('https://github.com/FiloSottile/mkcert')
    Printer.instruction('Follow the installation instructions for your OS.')
    Printer.instructionFooter()
    Printer.footer()
    process.exit(1)
  }

  if (!certsExist()) {
    generateCerts()
  }

  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  }

  const server = https.createServer(httpsOptions, app)
  server.on('error', (error) => {
    if (error.code === 'EACCES') {
      Printer.header('[ERROR] Permission denied')
      Printer.subHeader('To allow Node.js to bind to port 443:')
      Printer.instructionHeader('For Linux:')
      Printer.instruction(`$ sudo setcap 'cap_net_bind_service=+ep' $(which node)`)
      Printer.instructionHeader('To revoke this permission later:')
      Printer.instruction(`$ sudo setcap -r $(which node)`)
      Printer.instructionHeader('For macOS:')
      Printer.instruction("You'll need to run your server with elevated privileges using 'sudo'.")
      Printer.instructionFooter()
      Printer.footer()
    } else {
      Printer.header('ERROR: Failed to start server')
      Printer.footer()
      console.error(error)
    }
  })

  server.listen(443, async () => {
    if (!(await isDomainLocallyConfigured(`${domain}`))) {
      Printer.header('[ERROR] Local domain not configured')
      Printer.subHeader('To set up a local domain:')
      Printer.instructionHeader('For Linux:')
      Printer.instruction(`$ echo '127.0.0.1 ${domain}' | sudo tee -a /etc/hosts`)
      Printer.instructionHeader('For macOS:')
      Printer.instruction(`$ sudo echo '127.0.0.1 ${domain}' >> /etc/hosts`)
      Printer.instructionFooter()
      Printer.footer()
      process.exit(1)
    }

    Printer.header(`[SUCCESS] Server running at https://${domain}/`)
    Printer.subHeader('Reminder:')
    Printer.instructionHeader('For Linux:')
    Printer.instruction('If you used `setcap` to grant Node.js permission, revoke it for security reasons:')
    Printer.instruction(`$ sudo setcap -r $(which node)`)
    Printer.instructionHeader('For macOS:')
    Printer.instruction('If you run with sudo, remember this grants full system permissions.')
    Printer.instructionFooter()
    Printer.footer()
  })
}

main()

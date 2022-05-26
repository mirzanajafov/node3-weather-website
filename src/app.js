const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode =require('./utils/geocode')
const forecast =require('./utils/forecast')

const app = express()  

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views') //if change views directory name to templates
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather ',
        name: 'Mirze'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About ',
        name: 'Mirze' 
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page .',
        name: 'Mirze' 
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
              error: 'You must provide a address term'
          }) 
      }

      geocode(req.query.address, (error, { latitude , longtitude, location} = {} ) => {
        if (error) {
            return res.send({ error })
        }
    
        forecast(latitude,longtitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        
        })
    })
    
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
      return res.send({
            error: 'You must provide a search term'
        }) 
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        message:'Help article not found' 
    })
})

app.get('*',(req, res) => {
    res.render('404', {
        message:'404 Not FOund!'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
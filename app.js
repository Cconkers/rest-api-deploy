const express = require('express'); // require --> commonJS
const crypto = require('node:crypto');
const movies = require('./movies.json');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');


const app = express();
app.use(express.json())
app.disable('x-powered-by');

const ACCEPTED_ORIGIN = [
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
        'http://localhost:1234',
]
//GET
app.get('/movies', (req, res) => {
        const origin = req.header('origin');
        if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
                res.header('Access-Control-Allow-Origin', origin);
        }

        const { genre } = req.query

        if (genre !== undefined && genre !== null) {
                const filteredMovies = movies.filter(
                        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
                )
                return filteredMovies.length > 0 && filteredMovies.length !== movies.length ? res.json(filteredMovies) : res.status(404).json({ message: 'Movie not found' })
        } else {
                return res.json(movies)
        }

});

app.get('/movies/:id', (req, res) => {
        const { id } = req.params
        const movie = movies.find(m => m.id === id)
        if (movie) return res.json(movie)
        res.status(404).json({ message: 'Movie not found with id' + id })
});

//POST
app.post('/movies', (req, res) => {
        const result = validateMovie(req.body)
        if (!result.success) {
                // 422  Unprocessable Entity        
                return res.status(400).json({ message: JSON.parse(result.error.message) })
        }
        const newMovie = {
                id: crypto.randomUUID(),
                ...result.data
        }
        movies.push(newMovie)
        res.status(201).json(newMovie)
});

//PATCH
app.patch('/movies/:id', (req, res) => {
        const result = validatePartialMovie(req.body);
        if (!result.success) {
                return res.status(400).json({ message: 'Not found id' + id })
        }

        const { id } = req.params
        const movieIndex = movies.findIndex(movie => movie.id === id)

        if (movieIndex === -1) {
                return res.status(404).json({ message: 'Not found' });
        }


        const updateMovie = {
                ...movies[movieIndex],
                ...result.data
        }

        movies[movieIndex] = updateMovie

        return res.json(updateMovie)
});

//DELETE
app.delete('/movies/:id', (req, res) => {
        const origin = req.header('origin');
        const { id } = req.params
        if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
                res.header('Access-Control-Allow-Origin', origin);
        }

        const movieIndex = movies.findIndex(movie => movie.id === id)

        if (movieIndex === -1) {
                return res.status(404).json({ message: 'Not found' });
        }

        movies.splice(movieIndex, 1)

        return res.send(204)
});

const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
        console.log(`'listening on port http://localhost: ${PORT}`);
});

app.options('/movies/:id', (req, res) => {
        const origin = req.header('origin');
        if (ACCEPTED_ORIGIN.includes(origin) || !origin) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        }
        res.send(200)
})
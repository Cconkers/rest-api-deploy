const z = require('zod');

const moviesSchema = z.object({
        title: z.string({
                invalid_type_error: 'Movie title must be a string',
                required_error: 'Movie title is required'
        }),
        year: z.number({
                invalid_type_error: 'Movie title must be a number',
        }).int().min(1900, {
                invalid_type_error: 'Movie rate must be equal or grater than 1900',
        }).max(2024, {
                invalid_type_error: 'Movie rate must equal or lower than 2024',
        }),
        director: z.string(),
        duration: z.number().int().positive(),
        rate: z.number().min(0, {
                invalid_type_error: 'Movie rate must be equal or grater than 0',
        }).max(10, {
                invalid_type_error: 'Movie rate must equal or lower than 10',
        }).default(5),
        poster: z.string().url({
                invalid_type_error: 'Poster must be a valid URL',
        }),
        genre: z.array(
                z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Crime']),
                {
                        required_error: 'Must have at least one genre',
                        invalid_type_error: 'Movie genre must be an array of strings'
                }

        )
});

function validateMovie(object) {
        return moviesSchema.safeParse(object);
}

function validatePartialMovie(object) {
        return moviesSchema.partial().safeParse(object);
}

module.exports = {
        validateMovie,
        validatePartialMovie
}
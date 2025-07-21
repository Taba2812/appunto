import { SignupFormSchema, FormState } from '@/app/lib/definitions'

const baseUrl = process.env.BASE_URL

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Prepare data for insertion into database
    const { name, email, password } = validatedFields.data;
    const res = await fetch(baseUrl + '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: name,
            password: password,
            email: email,
        }),
    });
}
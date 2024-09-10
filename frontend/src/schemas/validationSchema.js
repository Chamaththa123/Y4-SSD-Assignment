// validationSchema.js
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    
    username: yup
        .string()
        .required('Please add username')
        .min(4, 'Username must be at least 4 characters long')
        .max(16, 'Username cannot be longer than 16 characters')
        .matches(
        /^[A-Za-z0-9 ]+$/,
        'Username must be alphanumeric and can contain spaces'
        ),
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Please add email'),
    password: yup
        .string()
        .required('Please add password')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one lowercase, one uppercase, one number and one special character.'
        ),
    repassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match'),

});

export default validationSchema;
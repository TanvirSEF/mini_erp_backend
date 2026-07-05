import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Mini ERP API Engine',
    version: '1.0.0',
    description: 'Auto-generated API documentation.',
  },
  servers: [{ url: 'http://localhost:5000/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      UserResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'User registered successfully!' },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string', enum: ['Admin', 'Manager', 'Employee'] },
            },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Hasan' },
          email: { type: 'string', format: 'email', example: 'hasan@mail.com' },
          password: { type: 'string', format: 'password', example: 'secret123' },
          role: {
            type: 'string',
            enum: ['Admin', 'Manager', 'Employee'],
            default: 'Employee',
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'hasan@mail.com' },
          password: { type: 'string', format: 'password', example: 'secret123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'User authenticated successfully!' },
          data: {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string', enum: ['Admin', 'Manager', 'Employee'] },
                },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Something went wrong!' },
          errorDetails: { type: 'object' },
          stack: { type: 'string', nullable: true },
        },
      },
    },
  },
};

const outputFile = './src/docs/swagger.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);

import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Mini ERP API Engine',
    version: '1.0.0',
    description: 'Auto-generated API documentation.',
  },
  // paths already include api/v1 do not repeat here
  servers: [{ url: 'http://localhost:5000' }],
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
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Wireless Mouse' },
          sku: { type: 'string', example: 'MOUSE-001' },
          category: { type: 'string', example: 'Electronics' },
          purchasePrice: { type: 'number', example: 500 },
          sellingPrice: { type: 'number', example: 800 },
          stockQuantity: { type: 'number', example: 25 },
          image: { type: 'string', example: 'https://res.cloudinary.com/.../MOUSE-001.png' },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'sku', 'category', 'purchasePrice', 'sellingPrice', 'stockQuantity', 'file'],
        properties: {
          name: { type: 'string', example: 'Wireless Mouse' },
          sku: { type: 'string', example: 'MOUSE-001' },
          category: { type: 'string', example: 'Electronics' },
          purchasePrice: { type: 'number', example: 500 },
          sellingPrice: { type: 'number', example: 800 },
          stockQuantity: { type: 'number', example: 25 },
          file: { type: 'string', format: 'binary', description: 'Product image (jpg/png/webp)' },
        },
      },
      SaleInput: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string', example: '665f0c1a2b3c4d5e6f7a8b9c' },
                quantity: { type: 'number', example: 2 },
              },
            },
          },
        },
      },
      SaleResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Sale created successfully!' },
          data: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              items: { type: 'array', items: { type: 'object' } },
              grandTotal: { type: 'number', example: 1600 },
            },
          },
        },
      },
      DashboardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Dashboard stats retrieved successfully!' },
          data: {
            type: 'object',
            properties: {
              totalProducts: { type: 'number', example: 42 },
              salesCount: { type: 'number', example: 17 },
              totalSales: { type: 'number', example: 125000 },
              lowStockProducts: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
      Role: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', enum: ['Admin', 'Manager', 'Employee'] },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['product:read', 'sale:create'],
          },
          description: { type: 'string' },
          isSystem: { type: 'boolean' },
        },
      },
      RoleUpdateInput: {
        type: 'object',
        required: ['permissions'],
        properties: {
          permissions: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
            example: ['product:read', 'product:create', 'sale:create'],
          },
        },
      },
      UserRoleInput: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['Admin', 'Manager', 'Employee'] },
        },
      },
    },
  },
};

const outputFile = './src/docs/swagger.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(() => {
  // strip trailing slash autogen adds on collections
  const spec = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
  const cleaned: { [path: string]: any } = {};
  for (const [path, definition] of Object.entries(spec.paths)) {
    const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    cleaned[normalized] = definition;
  }
  spec.paths = cleaned;
  fs.writeFileSync(outputFile, JSON.stringify(spec, null, 2));
  console.log('Swagger spec generated.');
});

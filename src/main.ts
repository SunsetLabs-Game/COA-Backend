import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  try {
    // Load environment variables
    dotenv.config();

    // Create the app
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    // Add global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Set up Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('COA Backend API')
      .setDescription('The COA Backend API documentation')
      .setVersion('1.0')
      .addTag('blockchain')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Setup Swagger with dark theme
    SwaggerModule.setup('api', app, document, {
      customCss: `
        .swagger-ui { 
          background-color: #1a1a1a;
          color: #ffffff;
        }
        .swagger-ui .info .title,
        .swagger-ui .info h1, 
        .swagger-ui .info h2, 
        .swagger-ui .info h3, 
        .swagger-ui .info h4, 
        .swagger-ui .info h5,
        .swagger-ui .info .title,
        .swagger-ui .info p,
        .swagger-ui .info a,
        .swagger-ui .scheme-container .schemes>label,
        .swagger-ui .opblock-tag,
        .swagger-ui .opblock .opblock-summary-operation-id, 
        .swagger-ui .opblock .opblock-summary-path,
        .swagger-ui .opblock .opblock-summary-path__deprecated,
        .swagger-ui .opblock .opblock-summary-description,
        .swagger-ui .parameter__name,
        .swagger-ui .parameter__type,
        .swagger-ui .parameter__deprecated,
        .swagger-ui .parameter__in,
        .swagger-ui table thead tr th,
        .swagger-ui .response-col_status,
        .swagger-ui .response-col_description,
        .swagger-ui .response-col_links,
        .swagger-ui .responses-inner h4,
        .swagger-ui .responses-inner h5,
        .swagger-ui .model-title,
        .swagger-ui .model .property-name,
        .swagger-ui .model .property-type,
        .swagger-ui section.models h4,
        .swagger-ui .tab li {
          color: #ffffff !important;
        }
        .swagger-ui .opblock-tag {
          border-bottom: 1px solid #444444;
        }
        .swagger-ui .opblock {
          background: #2a2a2a;
          border: 1px solid #444444;
        }
        .swagger-ui .opblock .opblock-summary {
          border-bottom: 1px solid #444444;
        }
        .swagger-ui .opblock .opblock-section-header {
          background: #2a2a2a;
          border-bottom: 1px solid #444444;
        }
        .swagger-ui .scheme-container {
          background: #2a2a2a;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
        }
        .swagger-ui .btn {
          background: #4a4a4a;
          color: #ffffff;
          border: 2px solid #4a4a4a;
        }
        .swagger-ui .btn:hover {
          background: #5a5a5a;
        }
        .swagger-ui .btn.authorize {
          background: #49cc90;
          border-color: #49cc90;
          color: #ffffff;
        }
        .swagger-ui .btn.authorize:hover {
          background: #3bb27c;
        }
        .swagger-ui input[type=text], 
        .swagger-ui textarea {
          background: #333333;
          color: #ffffff;
          border: 1px solid #555555;
        }
        .swagger-ui select {
          background: #333333;
          color: #ffffff;
          border: 1px solid #555555;
        }
        .swagger-ui .table-container {
          background: #2a2a2a;
        }
        .swagger-ui table {
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid #444444;
        }
        .swagger-ui table tbody tr td {
          border-bottom: 1px solid #444444;
          color: #ffffff;
        }
        .swagger-ui .response-col_status {
          border-bottom: 1px solid #444444;
        }
        .swagger-ui .topbar {
          background-color: #1a1a1a;
        }
        .swagger-ui .model-box {
          background: #2a2a2a;
          border: 1px solid #444444;
        }
        .swagger-ui section.models {
          border: 1px solid #444444;
        }
        .swagger-ui section.models.is-open h4 {
          border-bottom: 1px solid #444444;
        }
        .swagger-ui .model-container {
          background: #2a2a2a;
          border: 1px solid #444444;
        }
        .swagger-ui .opblock-description-wrapper p, 
        .swagger-ui .opblock-external-docs-wrapper p, 
        .swagger-ui .opblock-title_normal p {
          color: #ffffff;
        }
        .swagger-ui .markdown p, 
        .swagger-ui .markdown pre, 
        .swagger-ui .renderedMarkdown p, 
        .swagger-ui .renderedMarkdown pre {
          color: #ffffff;
        }
      `,
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
      },
    });

    // Start the server
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();

/**
 * Generate OpenAPI YAML specification from Elysia app
 *
 * Usage: bun scripts/generate-openapi.ts
 * Output: openapi.yaml
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import yaml from "js-yaml";

// Set required env vars for app initialization (not actually used for OpenAPI generation)
process.env.ENABLE_SWAGGER = "true";
process.env.DB_USER = process.env.DB_USER || "placeholder";
process.env.DB_PASS = process.env.DB_PASS || "placeholder";
process.env.DB_NAME = process.env.DB_NAME || "placeholder";
process.env.REDIS_HOST = process.env.REDIS_HOST || "localhost";

// Import app after setting env
const { app } = await import("../src/app");

async function generateOpenAPI() {
  try {
    // Fetch the OpenAPI JSON from the swagger endpoint
    const response = await app.handle(
      new Request("http://localhost/docs/json")
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
    }

    const openApiJson = await response.json();

    // Convert to YAML
    const openApiYaml = yaml.dump(openApiJson, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });

    // Add header comment
    const header = `# Auto-generated OpenAPI specification
# Run: bun run openapi:gen
# Do not edit manually
#
`;

    // Write to file
    const outputPath = resolve(import.meta.dir, "../openapi.yaml");
    writeFileSync(outputPath, header + openApiYaml, "utf-8");

    console.log(`OpenAPI spec generated: ${outputPath}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to generate OpenAPI spec:", error);
    process.exit(1);
  }
}

generateOpenAPI();

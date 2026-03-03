import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const cwd = process.cwd();

function migrateDirectory(dirPath, isProject) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));

    files.forEach((file, index) => {
        const fullPath = path.join(dirPath, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const parsed = matter(content);

        let { data, content: body } = parsed;

        // Add published if missing
        if (data.published === undefined) {
            data.published = true;
        }

        // Add order if missing (sequential)
        if (data.order === undefined) {
            data.order = index + 1;
        }

        if (isProject) {
            // image -> heroImage
            if (!data.heroImage && data.image) {
                data.heroImage = data.image;
            }

            // category -> industry
            if (!data.industry && data.category) {
                data.industry = data.category;
            }

            // description -> excerpt (projects should have excerpt)
            if (!data.excerpt && data.description) {
                data.excerpt = data.description;
            }

            // remove legacy fields
            delete data.role;
            delete data.roles;
            delete data.image;
            delete data.category;
            delete data.description;
        } else {
            // For blog
            if (!data.coverImage && data.image) {
                data.coverImage = data.image;
                delete data.image;
            }
            // description -> excerpt mapping if excerpt empty
            if (!data.excerpt && data.description) {
                data.excerpt = data.description;
                delete data.description;
            }
        }

        // Re-stringify and write
        const newFileContent = matter.stringify(body, data);
        fs.writeFileSync(fullPath, newFileContent, 'utf8');
        console.log(`Migrated ${file}`);
    });
}

const projectsDir = path.join(cwd, 'content', 'projects');
const blogDir = path.join(cwd, 'content', 'blog');

migrateDirectory(projectsDir, true);
migrateDirectory(blogDir, false);

console.log("Migration complete.");

import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xmlPath = path.join(__dirname, '../../search.xml');
const outputPath = path.join(__dirname, '../src/data/questions.json');

try {
    console.log(`Reading XML from ${xmlPath}...`);
    const xmlData = fs.readFileSync(xmlPath, 'utf8');

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        cdataPropName: "__cdata"
    });

    console.log('Parsing XML...');
    const jObj = parser.parse(xmlData);

    const entries = jObj.search.entry;
    console.log(`Found ${entries.length} entries.`);

    const questions = entries.map((entry, index) => {
        // Extract tags
        let tags = [];
        if (entry.tags && entry.tags.tag) {
            if (Array.isArray(entry.tags.tag)) {
                tags = entry.tags.tag;
            } else {
                tags = [entry.tags.tag];
            }
        }

        // Extract categories
        let categories = [];
        if (entry.categories && entry.categories.category) {
            if (Array.isArray(entry.categories.category)) {
                categories = entry.categories.category;
            } else {
                categories = [entry.categories.category];
            }
        }

        // Content
        // fast-xml-parser with cdataPropName puts CDATA content in that prop
        let content = entry.content;
        if (entry.content && entry.content.__cdata) {
            content = entry.content.__cdata;
        }

        // Determine difficulty (Random for now as it's not in data)
        const difficulties = ['Easy', 'Medium', 'Hard'];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

        return {
            id: `q-${index}`,
            title: entry.title,
            content: content,
            tags: [...new Set([...tags, ...categories])], // Merge tags and categories
            difficulty: difficulty,
            originalLink: entry.url
        };
    });

    // Filter out non-interview questions if possible?
    // The user said "refer to these... interview questions".
    // The titles usually contain "面试题".
    // Let's filter for "面试题" or just keep all?
    // The user listed specific paths which are all "面试题".
    // I'll filter by checking if title or tags contain "面试" or "Interview" just to be safe,
    // but `search.xml` might contain other blog posts.
    // Looking at the file list, there are `2026`, `2025` dirs which might be blog posts.
    // I'll check if the title contains "面试" (Interview).

    const interviewQuestions = questions.filter(q =>
        q.title.includes('面试') ||
        q.tags.some(t => t.includes('面试'))
    );

    console.log(`Filtered ${interviewQuestions.length} interview questions.`);

    fs.writeFileSync(outputPath, JSON.stringify(interviewQuestions, null, 2));
    console.log(`Successfully wrote to ${outputPath}`);

} catch (error) {
    console.error('Error parsing data:', error);
}

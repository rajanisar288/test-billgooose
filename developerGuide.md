## Github commits flow - we are using husky web hook

✅ feat: Add user authentication
✅ fix(login): Fix login button click handler
✅ SI(92): Fixed initial setup of web and also added seo setup
✅ docs: Update API documentation
✅ chore: Update dependencies
✅ feat(auth): Implement JWT token validation
✅ fix: Resolve memory leak in data processing
✅ style: Format code according to project standards

❌ fix: fix login button # Subject should be sentence-case (capitalize first letter)
❌ FEAT: Add new feature # Type should be lowercase
❌ fix login # Missing colon (:)
❌ fix: Very long subject that exceeds the maximum character limit of 72 characters # Too long
❌ update: Update package # 'update' is not an allowed type
❌ feat: # Missing subject
❌ : Add feature # Missing type

## Code Quality Commands

npm run lint Check ESLint errors
npm run lint:fix Auto-fix ESLint errors
npm run format Format all files with Prettier
npm run format:check Check formatting without fixing
npm run type-check Run TypeScript type checking
npm run validate Run all checks (format:check + lint + type-check)
npm run validate:fix Auto-fix all issues (format + lint:fix + type-check)

## Development Commands

npm run dev Start Next.js development server
npm run build Build for production
npm run start Start production server
npm run clean Remove .next, out, dist, coverage directories

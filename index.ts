import ejs from "ejs";
import fs from "fs";
import { durationToMinutes, readDurationInMinsFromWords, ytOfficialData, markdownToSanitizedHtml, getTopArticles } from "./utils";
import { getArticle, getArticles, getAuthor, getPersonalityTestQuestions } from "./api";
import { personalityTestsData } from "./personality-tests-data";

console.log("🚀 Starting TherapyTips SSG build process...");

// Create builds directory if it doesn't exist
const buildsDir = "./builds";
if (!fs.existsSync(buildsDir)) {
  fs.mkdirSync(buildsDir, { recursive: true });
  console.log("📁 Created builds directory");
}

// Parse command line arguments
const args = process.argv.slice(2);
const copyPhotosFlag = args.includes("--copy-photos") || args.includes("--include-photos") || args.includes("-p");
const helpFlag = args.includes("--help") || args.includes("-h");

// Check for explicit environment argument
const envArg = args.find(arg => arg.startsWith("--env="))?.split("=")[1];

if (helpFlag) {
  console.log(`
🚀 TherapyTips SSG Build Tool

Usage: bun run build [options]

Options:
  --env=[dev|stage|prod]                 Specify target environment explicitly
  --copy-photos, --include-photos, -p    Include photos directory in build (disabled by default)
  --help, -h                             Show this help message

Environment Variables:
  NODE_ENV or BUILD_ENV                  Target environment (development, staging, production)
  COPY_PHOTOS or INCLUDE_PHOTOS          Enable photo copying (alternative to --copy-photos flag)

Examples:
  bun run build:dev                      Build for development only
  bun run build:prod --copy-photos       Build for production only with photos
  bun run build --env=dev                Build for development only
  bun run build                          Build all environments (when no specific env detected)
`);
  process.exit(0);
}

// Determine which environment to build
const NODE_ENV = process.env.NODE_ENV;
const BUILD_ENV = process.env.BUILD_ENV;
const API_BASE_URL = process.env.API_BASE_URL;

// Determine target environment from multiple sources
let targetEnvironment: string | null = null;

// 1. Check explicit command line argument
if (envArg) {
  if (["dev", "stage", "prod"].includes(envArg)) {
    targetEnvironment = envArg;
  } else {
    console.error(`❌ Invalid environment: ${envArg}. Must be one of: dev, stage, prod`);
    process.exit(1);
  }
}

// 2. Check NODE_ENV and BUILD_ENV
if (!targetEnvironment) {
  if (NODE_ENV === "development" || BUILD_ENV === "development") {
    targetEnvironment = "dev";
  } else if (NODE_ENV === "staging" || BUILD_ENV === "staging") {
    targetEnvironment = "stage";
  } else if (NODE_ENV === "production" || BUILD_ENV === "production") {
    targetEnvironment = "prod";
  }
}

// 3. Detect environment based on API_BASE_URL (fallback detection)
if (!targetEnvironment && API_BASE_URL) {
  if (API_BASE_URL.includes("localhost") || API_BASE_URL.includes("3000")) {
    targetEnvironment = "dev";
  } else if (API_BASE_URL.includes("staging")) {
    targetEnvironment = "stage";
  } else if (API_BASE_URL.includes("api.therapytips.org")) {
    targetEnvironment = "prod";
  }
}

// If no specific environment is set, build all environments
const environments = targetEnvironment ? [targetEnvironment] : ["dev", "stage", "prod"];

if (targetEnvironment) {
  console.log(`🎯 Building for ${targetEnvironment.toUpperCase()} environment only`);
} else {
  console.log("🎯 No specific environment detected, building all environments");
}

async function performBuild(environment: string) {
  console.log(`\n🔨 Starting ${environment.toUpperCase()} build...`);
  
  const outputPath = `${buildsDir}/${environment}`;
  console.log(`📁 Output directory: ${outputPath}`);

  // Environment-specific configuration
  const shouldCopyPhotos = copyPhotosFlag || process.env.COPY_PHOTOS === "true" || process.env.INCLUDE_PHOTOS === "true";
  
  const config = {
    dev: {
      minifyAssets: false,
      includeDebugInfo: true,
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
      copyPhotos: shouldCopyPhotos,
    },
    stage: {
      minifyAssets: true,
      includeDebugInfo: true,
      apiBaseUrl: process.env.API_BASE_URL || "https://staging-api.therapytips.org",
      copyPhotos: shouldCopyPhotos,
    },
    prod: {
      minifyAssets: true,
      includeDebugInfo: false,
      apiBaseUrl: process.env.API_BASE_URL || "https://api.therapytips.org",
      copyPhotos: shouldCopyPhotos,
    }
  };

  const envConfig = config[environment as keyof typeof config] || config.dev;
  console.log(`⚙️ Using configuration:`, envConfig);

  console.log("📺 Fetching YouTube data...");
  const ytUrlLanding = "https://www.youtube.com/watch?v=-4u-egrCw1A"
  const ytUrlArticles = "https://www.youtube.com/watch?v=XrcXYrU_ETg"
  const ytUrlInterviews = "https://www.youtube.com/watch?v=s2TUkAnUXt0"
  const ytUrlAdvice = "https://www.youtube.com/watch?v=bqHVTUFGQao"
  const ytUrlPersonalityTests = "https://www.youtube.com/watch?v=mu2tbABwVcA"
  const ytDataLanding = await ytOfficialData(ytUrlLanding);
  const ytDataArticles = await ytOfficialData(ytUrlArticles);
  const ytDataInterviews = await ytOfficialData(ytUrlInterviews);
  const ytDataAdvice = await ytOfficialData(ytUrlAdvice);
  const ytDataPersonalityTests = await ytOfficialData(ytUrlPersonalityTests);
  console.log("✅ YouTube data fetched successfully");

  console.log("📝 Fetching advice articles...");
  const advice = await Promise.all([
    getArticle("3-surprising-benefits-of-a-reverse-bucket-list"),
    getArticle("3-emotionally-nourishing-shifts-to-make-your-day-more-fulfilling"),
    // getArticle("3-clues-your-people-pleasing-is-rooted-in-trauma"),
    // getArticle("3-subtle-habits-that-sabotage-your-growth"),
    // getArticle("3-reasons-why-constructive-complaining-is-actually-healthy"),
    // getArticle("how-to-stop-feeling-like-youre-falling-behind-in-life"),
    // getArticle("3-habits-that-can-help-you-avoid-burnout"),
    // getArticle("3-non-negotiables-to-add-to-your-dating-checklist"),
    // getArticle("3-things-you-should-never-do-before-a-first-date"),
  ]);
  console.log(`✅ Fetched ${advice.length} advice articles`);

  console.log("📰 Fetching main articles...");
  const articles = await Promise.all([
    getArticle("a-psychologist-explains-the-surprising-link-between-skipping-breakfast-and-depression"),
    getArticle("3-reasons-why-you-cant-stop-thinking-about-your-ex"),
    getArticle("3-ways-your-beliefs-about-sex-affect-your-relationships"),
    getArticle("4-types-of-teen-anger-and-what-they-actually-mean"),
    // getArticle("2-signs-youre-the-kind-of-cool-everyone-secretly-admires"),
    // getArticle("a-psychologist-explains-the-conflict-paradox-in-relationships"),
    // getArticle("3-types-of-silence-that-can-heal-relationships-after-a-fight"),
    // getArticle("how-short-video-addiction-alters-your-brain"),
    // getArticle("3-ways-to-tell-if-youre-ready-to-let-go-of-your-ex"),
    // getArticle("2-clues-that-youre-under-functioning-in-love"),
    // getArticle("3-signs-your-partner-is-emotionally-mature"),
    // getArticle("2-surprising-truths-about-tattooed-people"),
    // getArticle("2-reasons-memes-matter-more-than-you-realize"),
    // getArticle("3-ways-over-functioning-is-quietly-draining-your-energy"),
    // getArticle("2-destructive-extremes-in-relationships-and-what-they-mean"),
    // getArticle("3-red-flags-in-friendships-people-often-overlook"),
    // getArticle("2-hidden-beliefs-that-feed-sexual-shame"),
    // getArticle("3-red-flags-that-are-often-confused-with-love"),
    // getArticle("3-traits-emotionally-safe-couples-have-in-common"),
    // getArticle("3-automatic-habits-that-keep-long-term-relationships-strong"),
    // getArticle("4-questions-that-reveal-how-marriage-has-changed-your-relationship"),
    // getArticle("3-relationship-dynamics-that-are-really-about-power"),
    // getArticle("a-psychologist-breaks-down-the-profession-with-the-highest-infidelity-rates"),
    // getArticle("3-signs-youre-attached-but-not-in-love"),
    // getArticle("2-marriage-myths-that-do-more-harm-than-good"),
    // getArticle("2-signs-youre-losing-yourself-in-relationships"),
    // getArticle(
    //   "2-ways-being-the-golden-child-of-a-narcissist-hurts-your-relationships"
    // ),
    // getArticle("3-hidden-costs-of-being-told-youre-not-like-others"),
  ]);
  console.log(`✅ Fetched ${articles.length} main articles`);

  console.log("📝 Fetching personality test articles...");
  const personalityTests = await Promise.all([
    getArticle("codependency-scale"),
    getArticle("beck-depression-inventory"),
  ]);

  console.log("📝 Fetching interviews articles...");
  const interviews = await Promise.all([
    getArticle(
      "university-of-cologne-research-explores-how-parenthood-contributes-to-more-meaning-in-life"
    ),
    getArticle(
      "new-research-explains-the-role-of-future-anxiety-in-delayed-parenthood"
    ),
    getArticle(
      "a-successful-entrepreneur-explains-what-it-takes-to-reinvent-yourself"
    ),
    getArticle(
      "azusa-pacific-university-researchers-reveal-the-psychological-driving-forces-behind-the-ick"
    ),
  ]);
  console.log(`✅ Fetched ${interviews.length} interviews articles`);

  console.log("🧠 Loading personality tests data...");
  console.log(`✅ Loaded ${personalityTestsData.length} personality tests for generation`);

  console.log("📊 Preparing trending items data...");
  const trendingItems = await getTopArticles("./secrets/top-articles-analytics-17fb31d93929.json", "272582946");
  console.log(`✅ Prepared ${trendingItems.length} trending items`);

  const ytUrlArr = [
    "https://www.youtube.com/watch?v=IaJmyY1rjs8",
    "https://www.youtube.com/watch?v=EFC_IolRbh0",
  ];

  console.log(`📺 Fetching additional YouTube videos (${ytUrlArr.length} videos)...`);
  const ytDataArr = await Promise.all(
    ytUrlArr.map((url) => ytOfficialData(url))
  );
  console.log(`✅ Fetched ${ytDataArr.length} additional YouTube videos`);

  const latestArticles = await getArticles({
    limit: 12,
    article_type: "articles",
    date_to: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }),
    date_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 2).toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }),
  });
  console.log(`✅ Fetched ${latestArticles.length} latest articles`);

  const latestInterviews = await getArticles({
    limit: 12,
    article_type: "interviews",
    sort: "publication_date_desc",
  });
  console.log(`✅ Fetched ${latestInterviews.length} latest interviews`);

  const latestAdvice = await getArticles({
    limit: 12,
    article_type: "advice",
    date_to: new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }),
    date_from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 2).toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }),
  });
  console.log(`✅ Fetched ${latestAdvice.length} latest advice`);

  const latestPersonalityTests = await getArticles({
    limit: 16,
    article_type: "personality-tests",
  });
  console.log(`✅ Fetched ${latestPersonalityTests.length} latest personality tests`);

  // Fetch 10 articles for individual page generation
  console.log("📝 Fetching articles for individual page generation...");
  const articlesForPages = await getArticles({
    limit: 10,
    article_type: "articles",
    sort: "publication_date_desc",
  });
  console.log(`✅ Fetched ${articlesForPages.length} articles for individual pages`);

  const adviceForPages = await getArticles({
    limit: 10,
    article_type: "advice",
    sort: "publication_date_desc",
  });
  console.log(`✅ Fetched ${adviceForPages.length} advice articles for individual pages`);

  const interviewsForPages = await getArticles({
    limit: 10,
    article_type: "interviews",
    sort: "publication_date_desc",
  });
  console.log(`✅ Fetched ${interviewsForPages.length} interviews for individual pages`);

  const personalityTestsForPages = await getArticles({
    limit: 10,
    article_type: "personality-tests",
    sort: "publication_date_desc",
  });
  console.log(`✅ Fetched ${personalityTestsForPages.length} personality tests for individual pages`);

  const personalityTestQuestions = await Promise.all(personalityTestsForPages.map(async (test) => {
    return await getPersonalityTestQuestions(test.id!);
  }));

  // Clean and create output directory
  console.log("🗂️ Cleaning output directory...");
  fs.rmSync(outputPath, { recursive: true, force: true });
  console.log("✅ Output directory cleaned");
  
  console.log("📁 Creating output directory...");
  fs.mkdirSync(outputPath, { recursive: true });
  console.log("✅ Output directory created");

  // Template rendering data
  const templateData = {
    ytDataLanding: ytDataLanding,
    ytDataArticles: ytDataArticles,
    ytDataInterviews: ytDataInterviews,
    ytDataAdvice: ytDataAdvice,
    ytDataPersonalityTests: ytDataPersonalityTests,
    advice: advice,
    articles: articles,
    items: trendingItems,
    ytDataArr: ytDataArr,
    personalityTests: personalityTests,
    interviews: interviews,
    latestArticles: latestArticles,
    latestInterviews: latestInterviews,
    latestAdvice: latestAdvice,
    latestPersonalityTests: latestPersonalityTests,
    generatedPersonalityTests: personalityTestQuestions, // Add our 10 generated personality tests
    durationToMinutes: durationToMinutes,
    readDurationInMinsFromWords: readDurationInMinsFromWords,
    environment: environment,
    config: envConfig, // Add environment-specific config
    buildTime: new Date().toISOString(), // Add build timestamp
  };

  // Render and write pages
  const pages = [
    {
      template: "./views/landing-page.ejs",
      output: "index.html",
      data: {
        page: "landing",
        ytData: templateData.ytDataLanding,
        advice: templateData.advice,
        articles: templateData.articles,
        items: templateData.items,
        ytDataArr: templateData.ytDataArr,
        personalityTests: templateData.personalityTests,
        interviews: templateData.interviews,
        durationToMinutes: templateData.durationToMinutes,
        readDurationInMinsFromWords: templateData.readDurationInMinsFromWords,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    },
    {
      template: "./views/articles-page.ejs",
      output: "articles.html",
      data: {
        page: "articles",
        ytData: templateData.ytDataArticles,
        articles: templateData.latestArticles,
        items: templateData.items,
        ytDataArr: templateData.ytDataArr,
        durationToMinutes: templateData.durationToMinutes,
        readDurationInMinsFromWords: templateData.readDurationInMinsFromWords,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    },
    {
      template: "./views/interviews-page.ejs",
      output: "interviews.html",
      data: {
        page: "interviews",
        ytData: templateData.ytDataInterviews,
        interviews: templateData.latestInterviews,
        items: templateData.items,
        ytDataArr: templateData.ytDataArr,
        durationToMinutes: templateData.durationToMinutes,
        readDurationInMinsFromWords: templateData.readDurationInMinsFromWords,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    },
    {
      template: "./views/advice-page.ejs",
      output: "advice.html",
      data: {
        page: "advice",
        ytData: templateData.ytDataAdvice,
        advice: templateData.latestAdvice,
        items: templateData.items,
        ytDataArr: templateData.ytDataArr,
        durationToMinutes: templateData.durationToMinutes,
        readDurationInMinsFromWords: templateData.readDurationInMinsFromWords,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    },
    {
      template: "./views/personalitytests-page.ejs",
      output: "personality-tests.html",
      data: {
        page: "personality-tests",
        ytData: templateData.ytDataPersonalityTests,
        personalityTests: templateData.latestPersonalityTests,
        items: templateData.items,
        ytDataArr: templateData.ytDataArr,
        durationToMinutes: templateData.durationToMinutes,
        readDurationInMinsFromWords: templateData.readDurationInMinsFromWords,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    },
    {
      template: "./views/book-publication.ejs",
      output: "book-publication.html",
      data: {
        page: "book-publication",
        items: templateData.items,
        environment: templateData.environment,
        config: templateData.config,
        buildTime: templateData.buildTime,
      }
    }
  ];

  // Render all pages
  for (const page of pages) {
    await new Promise<void>((resolve, reject) => {
      console.log(`🎨 Rendering ${page.output}...`);
      ejs.renderFile(page.template, page.data, (err, str) => {
        if (err) {
          console.error(`❌ Error rendering ${page.output}:`, err);
          reject(err);
        } else {
          console.log(`✅ ${page.output} rendered successfully`);
          console.log(`💾 Writing ${page.output}...`);
          fs.writeFileSync(`${outputPath}/${page.output}`, str);
          console.log(`✅ ${page.output} written to ${outputPath}/${page.output}`);
          resolve();
        }
      });
    });
  }

  // Generate individual article pages
  console.log("\n📖 Generating individual article pages...");

  // Create subdirectories for each content type
  const contentTypes = [
    { name: "articles", data: articlesForPages, directory: "articles" },
    { name: "advice", data: adviceForPages, directory: "advice" },
    { name: "interviews", data: interviewsForPages, directory: "interviews" },
    { name: "personality-tests", data: personalityTestsForPages, directory: "personality-tests" }
  ];

  for (const contentType of contentTypes) {
    const contentDir = `${outputPath}/${contentType.directory}`;
    console.log(`📁 Creating ${contentType.name} directory: ${contentDir}`);
    
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
      console.log(`✅ ${contentType.name} directory created`);
    } else {
      console.log(`ℹ️ ${contentType.name} directory already exists`);
    }

    console.log(`🎨 Rendering ${contentType.data.length} ${contentType.name} pages...`);
    
    for (const article of contentType.data) {
      await new Promise<void>(async (resolve, reject) => {
        try {
          const fileName = `${article.slug}.html`;
          const filePath = `${contentDir}/${fileName}`;
          
          // Fetch complete author information if available
          let authorData = {
            name: (article as any).author_name || "Unknown Author",
            bio: "",
            image_url: ""
          };

          if (article.author_id) {
            try {
              console.log(`    👤 Fetching author data for author ID: ${article.author_id}...`);
              const fullAuthor = await getAuthor(article.author_id);
              authorData = {
                name: fullAuthor.name,
                bio: fullAuthor.bio || "",
                image_url: fullAuthor.image_url || ""
              };
              console.log(`    ✅ Author data fetched for ${fullAuthor.name}`);
            } catch (error) {
              console.warn(`    ⚠️ Failed to fetch author data for ID ${article.author_id}:`, error);
              // Keep the fallback author data
            }
          }
          
          const articleData = {
            article: article,
            author: authorData,
            items: trendingItems,
            ytData: ytDataArticles,
            ytDataArr: ytDataArr,
            durationToMinutes: durationToMinutes,
            readDurationInMinsFromWords: readDurationInMinsFromWords,
            markdownToSanitizedHtml: markdownToSanitizedHtml,
            environment: environment,
            config: envConfig,
            buildTime: templateData.buildTime,
            questions: Object.values(personalityTestQuestions.find(question => question.article_id === article.id)?.questions_json || {}),
            process: {
              env: {
                BASE_URL: process.env.BASE_URL,
                BASE_DIR: process.env.BASE_DIR 
              }
            }
          };

          // Choose the appropriate template based on content type
          const templateFile = contentType.name === "personality-tests" 
            ? "./views/personalitytest-content-page.ejs" 
            : "./views/article-content-page.ejs";

          console.log(`  🎨 Rendering ${fileName}...`);
          ejs.renderFile(templateFile, articleData, (err, str) => {
            if (err) {
              console.error(`❌ Error rendering ${fileName}:`, err);
              reject(err);
            } else {
              console.log(`  💾 Writing ${fileName}...`);
              fs.writeFileSync(filePath, str);
              console.log(`  ✅ ${fileName} written to ${filePath}`);
              resolve();
            }
          });
        } catch (error) {
          console.error(`❌ Error processing article ${article.slug}:`, error);
          reject(error);
        }
      });
    }
    
    console.log(`✅ Completed rendering ${contentType.data.length} ${contentType.name} pages\n`);
  }
 
  console.log("🎉 Individual article page generation completed!");
 
  // Copy static assets
  console.log("🎨 Copying CSS file...");
  fs.copyFileSync(`./assets/css/style.css`, `${outputPath}/style.css`);
  console.log(`✅ CSS file copied to ${outputPath}/style.css`);
 
  console.log("🖼️ Setting up images directory...");
  if (!fs.existsSync(`${outputPath}/assets/images`)) {
    fs.mkdirSync(`${outputPath}/assets/images`, { recursive: true });
    console.log("✅ Images directory created");
  } else {
    console.log("ℹ️ Images directory already exists");
  }
 
  console.log("🖼️ Copying image files...");
  const imageFiles = fs.readdirSync(`./assets/images`);
  console.log(`📸 Found ${imageFiles.length} image files to copy`);
 
  for (const file of imageFiles) {
    fs.copyFileSync(
      `./assets/images/${file}`,
      `${outputPath}/assets/images/${file}`
    );
  }
  console.log(`✅ Copied ${imageFiles.length} image files`);
 
  // Optional photo copying (disabled by default)
  if (envConfig.copyPhotos) {
    console.log("📷 Setting up photos directory...");
    const photosDestPath = `${outputPath}/photos`;
    if (fs.existsSync(photosDestPath)) {
      console.log("🗂️ Removing existing photos directory...");
      fs.rmSync(photosDestPath, { recursive: true, force: true });
      console.log("✅ Existing photos directory removed");
    }
 
    if (fs.existsSync('./photos')) {
      console.log("📷 Copying photos directory...");
      fs.cpSync('./photos', photosDestPath, { recursive: true });
      const photoFiles = fs.readdirSync('./photos', { recursive: true });
      console.log(`✅ Photos directory copied with ${photoFiles.length} files`);
    } else {
      console.log("⚠️ Photos directory not found in current directory");
    }
  } else {
    console.log("📷 Skipping photos directory (use --copy-photos flag or COPY_PHOTOS=true to enable)");
  }
 
  console.log(`🎉 ${environment.toUpperCase()} build completed successfully!`);
}
 
 // Build all environments
 async function buildAll() {
   for (const env of environments) {
     await performBuild(env);
   }
   
   if (environments.length > 1) {
     console.log("\n🎊 All builds completed successfully!");
     console.log("📁 Build outputs:");
     for (const env of environments) {
       console.log(`   - ${env}: ./builds/${env}/`);
     }
   } else if (environments.length === 1) {
     const singleEnv = environments[0]!;
     console.log(`\n🎊 ${singleEnv.toUpperCase()} build completed successfully!`);
     console.log(`📁 Build output: ./builds/${singleEnv}/`);
   }
 }
 
 // Execute builds
 buildAll().catch((error) => {
   console.error("❌ Build process failed:", error);
   process.exit(1);
 });
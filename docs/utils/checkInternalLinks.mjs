import { globby } from "globby";
import { readSync } from 'to-vfile';
import { remark } from 'remark';
import remarkValidateLinks from 'remark-validate-links';
import reporter from "vfile-reporter";

const checkReasonMatch = (reason, headingToCheck) => {
  const match = reason.match(new RegExp("^Link to unknown heading: \`" + headingToCheck))
  return match
}

const checkExceptions = (message) => {
  /* Only specific headings are missing due to shortcodes, so only check that kind of warning */
  if (message.ruleId === 'missing-heading') {
    /* Exceptions for specific files */
    if (message.file.match(/varnish\.md$/)) {
      return !(checkReasonMatch(message.reason, "1-configure-the-service") || checkReasonMatch(message.reason, "example-configuration"))
    }
    if (message.file.match(/vault\.md$/)) {
      return !(checkReasonMatch(message.reason, "1-configure-the-service") || checkReasonMatch(message.reason, "2-add-the-relationship"))
    }
    if (message.file.match(/nodejs\/_index\.md$/)) {
      return !(checkReasonMatch(message.reason, "configuration-reader"))
    }

    /* Global exception for plan names */
    return !checkReasonMatch(message.reason, "dedicated-gen-2")
  }
  return true
}

const checkInternalLinks = async () => {
  /* Get all docs Markdown files */
  const files = await globby("src/**/*.md");

  /* Get list of files that have been checked for valid internal links */
  const validatedFilePromises = Promise.all(files.map(async (file) => {
    /* create a virtual file, which allows messages to be stored with the file */
    const virtualFile = readSync(file);

    /* Check the links in the virtual file */
    const validatedFile = await remark()
      .use(remarkValidateLinks)
      .process(virtualFile);

    return validatedFile;
  }))
  const validatedFiles = await validatedFilePromises

  /* Return only files that have broken links */
  const filesWithBrokenLinks = validatedFiles.reduce((filesAcc, file) => {
    const relevantMessages = file.messages.reduce((messageAcc, message) => {
      /* Add messages if they don't match exceptions */
      if (checkExceptions(message)) messageAcc.push(message)
      return messageAcc
    }, [])

    /* Add files if they have messages */
    if (relevantMessages?.length > 0) {
      /* Only add the relevant messages */
      const fileWithRelevantMessages = { ...file, messages: relevantMessages }
      filesAcc.push(fileWithRelevantMessages)
    }

    return filesAcc
  }, [])

  /* Report and error if there are any files with broken links */
  if (filesWithBrokenLinks?.length > 0) {
    console.error("Broken links found in the Markdown:\n", reporter(filesWithBrokenLinks))
    process.exit(1)
  }
}


checkInternalLinks()
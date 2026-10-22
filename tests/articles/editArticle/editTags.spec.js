import { test } from '../../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { EditArticlePage } from '../../../src/ui/pages/article/EditArticlePage';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { faker } from '@faker-js/faker';

const testParameters = [
    { tagsNumber: 1, testNameEnding: 'one tag' },
    { tagsNumber: 2, testNameEnding: 'two tags' },
    { tagsNumber: 5, testNameEnding: 'five tags' },
];

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
    test.describe('Delete tags from article tests', () => {
        let article;
        test.beforeEach(async ({ pages, user, logger }) => {
            await signUpUser(pages[0], user);
            article = generateNewArticleData(logger, tagsNumber);
            article = await createArticle(pages[0], article);
            logger.debug(`Article: ${article.url}`);
        });

        test(`Remove tags from article with ${testNameEnding}`, async ({ pages }) => {
            const editArticlePage = new EditArticlePage(pages[0], 0);
            const articleId = new URL(article.url).pathname.split('/').pop();
            await editArticlePage.open(articleId);
            await editArticlePage.removeTags(article.tags);
            await editArticlePage.clickUpdateArticleButton();
            const articlePage = new ViewArticlePage(pages[0], 0);
            await articlePage.open(article.url);
            await articlePage.assertArticleTagsAreNotVisible(article.tags);
        });
    });

    test.describe('Add tags to article tests', () => {
        let article;
        test.beforeEach(async ({ pages, user, logger }) => {
            await signUpUser(pages[0], user);
            article = generateNewArticleData(logger, 0);
            article = await createArticle(pages[0], article);
            logger.debug(`Article: ${article.url}`);
        });

        test(`Add tags to article with ${testNameEnding}`, async ({ pages }) => {
            const editArticlePage = new EditArticlePage(pages[0], 0);
            const articleId = new URL(article.url).pathname.split('/').pop();
            await editArticlePage.open(articleId);

            const newTags = [];
            for (let i = 0; i < tagsNumber; i++) {
                newTags.push(faker.lorem.words(tagsNumber));
            }

            await editArticlePage.fillTagsField(newTags);
            await editArticlePage.clickUpdateArticleButton();
            const articlePage = new ViewArticlePage(pages[0], 0);
            await articlePage.open(article.url);
            await articlePage.assertArticleTagsAreVisible(newTags);
        });
    });
});

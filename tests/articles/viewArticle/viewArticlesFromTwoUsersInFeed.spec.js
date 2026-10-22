import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({ contextsNumber: 3, usersNumber: 3 });

let articleWithoutTags;
let articleWithOneTag;

test.beforeEach(async ({ pages, users, articleWithoutTags, articleWithOneTag }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await signUpUser(pages[2], users[2], 3);
  articleWithoutTags = await createArticle(pages[0], articleWithoutTags, 1);
  articleWithOneTag = await createArticle(pages[1], articleWithOneTag, 2);
});

test('View an article created by another user', async ({
  articleWithoutTags,
  articleWithOneTag,
  pages,
  users,
}) => {
  const homePage = new HomePage(pages[2], 3);

  await homePage.open();

  await homePage.assertGlobalFeedTabIsVisible();
  await homePage.clickGlobalFeedTab();

  await homePage.assertArticleIsVisible(articleWithoutTags, users[0]);

  await homePage.assertArticleIsVisible(articleWithOneTag, users[1]);
});

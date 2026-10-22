import { expect, testStep } from '../../common/pwHelpers/pw';

export class HomePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.yourFeedTab = page.getByText('Your Feed');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.globalFeedTab = page.getByText('Global Feed');
  }

  async open() {
    await this.step(`Open the Home page`, async () => {
      await this.page.goto('/');
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async clickNewArticleLink() {
    await this.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await this.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async assertGlobalFeedTabIsVisible() {
    await this.step(`Assert the 'Global Feed' tab is visible`, async () => {
      await expect(this.globalFeedTab).toBeVisible();
    });
  }

  async clickGlobalFeedTab() {
    await this.step(`Click the 'Global Feed' tab`, async () => {
      await this.globalFeedTab.click();
    });
  }

  articleTag(title, tag) {
    return this.page
      .locator('.article-preview')
      .filter({
        has: this.page.getByRole('heading', {
          name: `Article title: ${title}`,
        }),
      })
      .locator('ul.tag-list')
      .getByText(tag, { exact: true });
  }

  async assertArticleIsVisible(article, user) {
    const articleTitle = article.title.slice(0, 10);
    const username = user.username.toLowerCase();
    await this.step(`Assert the article ${articleTitle}... of user ${username} is visible`, async () => {
      await expect(this.page.getByRole('heading', {
        name: `Article title: ${article.title}`
      })).toBeVisible();
      await expect(this.page.getByText(`Article description: ${article.description}`)).toBeVisible();
      await expect(this.page.getByText(username)).toBeVisible();
      for (let i = 0; i < article.tags.length; i++) {
        await expect(this.articleTag(article.title, article.tags[i])).toBeVisible();
      }
    });
  }
}

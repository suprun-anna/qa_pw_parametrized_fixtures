import { expect, testStep } from '../../../common/pwHelpers/pw';

export class EditArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
    this.tagField = page.getByPlaceholder('Enter tags');
    this.updateArticleButton = page.getByRole('button', {
      name: 'Update Article',
    });
    this.tagField = page.getByPlaceholder('Enter tags');
  }

  async open(url) {
    await this.step(`Open the article page`, async () => {
      await this.page.goto('/editor/' + url);
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async assertArticleTitle(title) {
    await this.step(`Assert the article has correct title'`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await this.step(`Assert the article has correct text'`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async removeTag(tag) {
    await this.step(`Remove the tag from the 'Tags' field`, async () => {
      const tagItem = this.page.locator('span').filter({ hasText: tag }).locator('i');
      await tagItem.click();
    });
  }

  async removeTags(tags) {
    await this.step(`Remove tags from the 'Tags' field`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await this.removeTag(tags[i]);
      }
    });
  }

  async fillTagsField(tags) {
    await this.step(`Fill the 'Tags' field`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await this.tagField.fill(tags[i]);
        await this.page.keyboard.press('Enter');
      }
    });
  }

  async clickUpdateArticleButton() {
    await this.step(`Click the 'Update Article' button`, async () => {
      await this.updateArticleButton.click();
    });
  }
}

import { Injectable } from '@angular/core';
import { defineOneEntry } from 'oneentry';
import { Link } from '../types/link.type';

const ONE_ENTRY_URL = "https://linktreecopy.oneentry.cloud";
const ONE_ENTRY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5ndWxhci1mcm9udGVuZCIsInNlcmlhbE51bWJlciI6MSwiaWF0IjoxNzM3OTk3OTE1LCJleHAiOjE3Njk1MzM4NjB9.Dx_6mxHrQQFo54Vq_6Cp9N1NX55AZQAGzNBDR625X8M";

let { Pages } = defineOneEntry(
  ONE_ENTRY_URL,
  {
    token: ONE_ENTRY_TOKEN,
    langCode: 'en_US',
  }
);

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor() {

  }

  async getLinks(): Promise<Link[]> {
    try {
      let pages = await Pages.getPages();
      return pages.map((page: any) => {
        const pageExistsOutside = page.attributeValues?.['page-exists-outside']?.value || false;
        const urlFormatted = page.localizeInfos?.['htmlContent']?.replace(/^<p>|<\/p>$/g, '') || '';
        const match = urlFormatted.match(/<a\s+href=["']([^"']+)["']/);
        const extractedUrl = match ? match[1] : '';

        return {
          title: page.localizeInfos?.['title'] || '',
          isVisible: page.isVisible || true,
          url: pageExistsOutside ? extractedUrl : page.pageUrl
        }
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

import { Component } from '@angular/core';
import { SitemapService } from '../../services/sitemap-service.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sitemap',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss'
})
export class SitemapComponent {
  links: string[] = [];
  constructor(private sitemapService: SitemapService) { }

  ngOnInit(): void {
    this.getLinks();
    // this.generateSitemap();
  }

  generateSitemap(): void {
    const sitemap = this.sitemapService.generateSitemap();
  
  }


  getLinks() {
    this.sitemapService.generateSitemapLinks().subscribe((links: string[]) => {
      this.links = links;

    })

  }
}

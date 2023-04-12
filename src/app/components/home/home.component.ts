
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { SearchService } from '../../core/services/search.service';
import { SearchBook } from 'src/app/core/models/search-book-response.model';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private cache: { [key: string]: SearchBook[] } = {};
  private isCalledFromClearSearch: boolean = false;


  bookSearch: FormControl;
  searchResultBooks: SearchBook[] = [];

  currentPage: number = 1; 
  totalPages: number = 1; 

  totalEntries: number = 0; 


  pageSize: number = 10;
  pagesArray: number[] = [];

  isLoading: boolean = false;

  constructor(private searchService: SearchService) {
    this.bookSearch = new FormControl('');
  }


  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];


  calculateRange(): string {
    const startIndex = (this.currentPage - 1) * this.pageSize + 1;
    const endIndex = Math.min(this.currentPage * this.pageSize, this.totalEntries);
    return `${startIndex} to ${endIndex} of ${this.totalEntries}`;
  }

  ngOnInit(): void {
    this.bookSearch.valueChanges.pipe(debounceTime(300)).subscribe((value: string) => {
      const pageSize = this.isCalledFromClearSearch ? 10 : this.pageSize;
      const currentPage = this.isCalledFromClearSearch ? 1 : this.currentPage;
     
      this.searchBooks(value, pageSize, 1);

      this.isCalledFromClearSearch = false;
    });
    this.searchBooks('*', this.pageSize, this.currentPage);
  }


  changePageSize(action: string) {
    if (action === 'up' && this.pageSize < 10) {
      this.pageSize += 1;
    } else if (action === 'down' && this.pageSize > 1) {
      this.pageSize -= 1;
    }
    this.searchBooks(this.bookSearch.value, this.pageSize, this.currentPage);
  }
  
  searchBooks(query: string, limit: number, page: number = 1) {
    this.isLoading = true; 

    const offset = (page - 1) * this.pageSize;
    query = this.bookSearch.value ? this.bookSearch.value : "*";

  
    const cacheKey = `${query}_${limit}_${offset}`;


    if(this.cache[cacheKey] && this.isCalledFromClearSearch == false ){  
    this.searchResultBooks = this.cache[cacheKey];
    console.log(this.searchResultBooks);
    this.currentPage = page;
    this.totalPages = Math.ceil(this.totalEntries / this.pageSize);

    this.pagesArray = Array.from({ length: Math.min(5, this.totalPages) }, (_, i) => i + 1);

    this.isLoading = false;
    }else{

    this.searchService.searchBooks(query, limit, offset).subscribe((data) => {
       

        this.searchResultBooks = data?.docs;
        this.totalEntries = data?.numFound; 

        this.currentPage = page;
        this.totalPages = Math.ceil(data?.numFound / this.pageSize);

        this.pagesArray = Array.from({ length: Math.min(5, this.totalPages) }, (_, i) => i + 1);
        
        this.isLoading = false; 

        this.cache[cacheKey] = this.searchResultBooks;
    });
  }
}

clearSearch() {
  this.bookSearch.setValue('');
  this.isCalledFromClearSearch = true;
}

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.searchBooks(this.bookSearch.value, this.pageSize, this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.searchBooks(this.bookSearch.value, this.pageSize, this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.searchBooks(this.bookSearch.value, this.pageSize, page);
    }
  }
}


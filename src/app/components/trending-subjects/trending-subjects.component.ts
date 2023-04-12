import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubjectsService } from '../../core/services/subjects.service';
import { Book } from 'src/app/core/models/book-response.model';
import { SearchService } from '../../core/services/search.service';
import { SearchBook } from 'src/app/core/models/search-book-response.model';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {

  isLoading: boolean = false;
  subjectName: string = '';
  allBooks: Book[] = [];
  searchResultBooks: SearchBook[] = [];

  constructor(
    private route: ActivatedRoute,
    private subjectsService: SubjectsService,
  ) {}

  getAllBooks() {

    this.isLoading = true; 

    this.subjectsService.getAllBooks(this.subjectName).subscribe((data) => {
      this.allBooks = data?.works;
      this.isLoading = false;
    });
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.isLoading = true;
      this.getAllBooks();
    });
  }
}

import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, Quote } from 'src/app/models/futurama.interface';
import { CharactersService } from 'src/app/services/characters.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
})
export class CharacterComponent implements OnInit {
  character: any = {};

  quotesList: any = [];
  panelOpenState = false;
  displayedColumns: string[] = ['text'];

  dataSource!: MatTableDataSource<Quote>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private charactersService: CharactersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.quotesList = new Array<Quote>();
  }

  ngOnInit(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id');

    if (identifier) {
      this.charactersService
        .getCharacterById(identifier)
        .subscribe((character: Character) => {
          if (!character) {
            return this.router.navigateByUrl('/');
          } else {
            this.character = character;
            this.quotesList = character.sayings.map((quote) => ({
              text: quote,
            }));
            this.dataSource = new MatTableDataSource<Quote>(this.quotesList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          return '';
        });
    }
  }
}

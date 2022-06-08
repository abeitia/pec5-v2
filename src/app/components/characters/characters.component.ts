import { Component, ViewChild, OnInit } from '@angular/core';
import { catchError, EMPTY, take } from 'rxjs';
import { Character } from 'src/app/models/rickandmorty.interface';
import { CharactersService } from 'src/app/services/characters.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
  animations: [
    trigger('tableAnimation', [
      state('waiting', style({ opacity: 1 })),
      state('loaded', style({ opacity: 1 })),
      transition('waiting => loaded', [
        query('.character_row', [
          style({ opacity: 0, transform: 'translateX(-300px)' }),
          stagger(500, [
            animate(
              '1500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  processing: boolean;
  animationState: string;

  displayedColumns: string[] = ['id', 'name', 'actions'];

  dataSource!: MatTableDataSource<Character>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private charactersService: CharactersService
  ) {
    this.characters = new Array<Character>();
    this.processing = false;
    this.animationState = 'waiting';
  }

  ngOnInit(): void {
    this.animationState = 'waiting';
    this.processing = true;
    this.loadCharacters();
  }

  showCharacter(id: number) {
    this.router.navigateByUrl('/character/' + id);
  }

  private loadCharacters(): void {
    this.charactersService
      .getAllCharacters()
      .pipe(
        take(1),
        catchError((err) => {
          console.log("Error => ", err);
          this.processing = false;
          return EMPTY;
        })
      )
      .subscribe((res: any) => {
        this.characters = res.results;
        this.processing = false;
        this.animationState = 'loaded';

        this.dataSource = new MatTableDataSource<Character>(this.characters);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}

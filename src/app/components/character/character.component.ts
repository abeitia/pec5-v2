import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from 'src/app/services/characters.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Character, Episode } from 'src/app/models/rickandmorty.interface';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
})
export class CharacterComponent implements OnInit {
  character: any = {};
  private episodesids: any = [];
  private episodesList: any = [];
  private episodes: any = [];

  panelOpenState = false;
  displayedColumns: string[] = ['episode',  'air_date'];

  dataSource!: MatTableDataSource<Episode>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private charactersService: CharactersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.episodesList = new Array<Episode>();
  }

  ngOnInit(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id');

    if (identifier) {
      this.charactersService
        .getCharacterById(identifier)
        .subscribe((character: Character) => {
          if (!character) {
            return this.router.navigateByUrl('/');
          }
          this.character = character;
          this.episodes = character.episode;
          this.setParams();
          this.getEpisodes();
          return '';
        });
    }
  }

  setParams() {
    this.episodesids = this.episodes.map((x: string) => {
      const y = x.match(/\d+/);
      let z;
      if (y) {
        z = +y[0];
      }
      return z;
    });
  }

  getEpisodes() {
    this.charactersService
      .getEpisodes('[' + this.episodesids.toString() + ']')
      .subscribe((episodes) => {
        this.episodesList = episodes;

        this.dataSource = new MatTableDataSource<Episode>(this.episodesList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}

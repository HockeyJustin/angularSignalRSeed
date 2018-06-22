import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../Hero';
//import { HEROES } from '../mock-heroes';
//import { HeroService } from '../services/hero.service';
import {HeroService} from '../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  //constructor() { }
  constructor(private heroService: HeroService) { }

  heroes: Hero[];

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void{
    //this.heroes = this.heroService.getHeroes();
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  };

  selectedHero: Hero;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

}

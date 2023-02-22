import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  pageTitle = 'The Food Hub';

  sideBarOpen = true

  _route_url = "/home";

  constructor(private router:Router, private title: Title) { }

  ngOnInit() {
 this.title.setTitle(this.pageTitle) 
   
   }


  hasRoute(route: string){
    return this.router.url.includes(route)
  }
}

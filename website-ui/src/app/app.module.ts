import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { PasswordMathcValidatorDirective } from "./sign-up-page/password-match.directive";
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobComponent } from './jobs-page/job/job.component';

import { AuthenticationGuardService } from '../services/routeGuards/authentication-guard.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MongodbService } from '../services/mongodb/mongodb.service';
import { UserPageComponent } from './user-page/user-page.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { JobDetailsPageComponent } from './job-details-page/job-details-page.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DetailsComponent } from './create-job-page/details/details.component';
import { UploadComponent } from './create-job-page/upload/upload.component';
import { SchemaComponent } from './create-job-page/schema/schema.component';
import { QueryComponent } from './create-job-page/query/query.component';
import { ExecuteComponent } from './create-job-page/execute/execute.component';
import { StatusLineComponent } from './jobs-page/job/status-line/status-line.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { FileSelectDirective } from 'ng2-file-upload';
import { GeneralPlotsComponent } from './create-job-page/query/general-plots/general-plots.component';
import { AggregationsComponent } from './create-job-page/query/aggregations/aggregations.component';
import { AggregationFilteringComponent } from './create-job-page/query/aggregation-filtering/aggregation-filtering.component';
import { AggregationClusteringComponent } from './create-job-page/query/aggregation-clustering/aggregation-clustering.component';

export function tokenGetter(): string {
  return localStorage.getItem("auth_token");
}

@NgModule({
  declarations: [
    AppComponent,
    MarketingPageComponent,
    LogInPageComponent,
    SignUpPageComponent,
    PasswordMathcValidatorDirective,
    JobsPageComponent,
    JobComponent,
    UserPageComponent,
    TopNavbarComponent,
    JobDetailsPageComponent,
    DashboardPageComponent,
    DetailsComponent,
    UploadComponent,
    SchemaComponent,
    QueryComponent,
    ExecuteComponent,
    StatusLineComponent,
    FileSelectDirective,
    GeneralPlotsComponent,
    AggregationsComponent,
    AggregationFilteringComponent,
    AggregationClusteringComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [],
        blacklistedRoutes: ["/ms/user/createAndGetJWT", "/auth/jwt/getToken"]
      }
    }),
    NgbModule
  ],
  providers: [
    AuthenticationService,
    MongodbService,
    AuthenticationGuardService,
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
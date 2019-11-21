import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingPageComponent } from './marketing-page/marketing-page.component';
import { LogInPageComponent } from './log-in-page/log-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { JobDetailsPageComponent } from './job-details-page/job-details-page.component';
import { AuthenticationGuardService } from '../services/routeGuards/authentication-guard.service';
import { CreateJobPageComponent } from './create-job-page/create-job-page.component';

const routes: Routes = [
  {path: "", component: MarketingPageComponent},
  {path: "logIn", component: LogInPageComponent},
  {path: "signUp", component: SignUpPageComponent},
  {path: "jobsPage", component: JobsPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "userPage", component: UserPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "jobDetailsPage/:job._id", component: JobDetailsPageComponent, canActivate: [AuthenticationGuardService]},
  {path: "createJobPage", component: CreateJobPageComponent, canActivate: [AuthenticationGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
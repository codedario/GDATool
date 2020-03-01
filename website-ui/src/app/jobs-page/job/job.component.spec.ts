import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JobComponent } from './job.component';
import { COMMON_IMPORTS, COMMON_DECLARATIONS, MOCK_STATUS_LINE, MOCK_JOB } from 'src/app/testResources';
import { By } from '@angular/platform-browser';

describe('JobComponent', () => {
  let component: JobComponent;
  let fixture: ComponentFixture<JobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: COMMON_DECLARATIONS,
      imports: COMMON_IMPORTS
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobComponent);
    component = fixture.componentInstance;
    
    const inputJob = fixture.debugElement.query(By.css('.job'));
    
    component.job = MOCK_JOB;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

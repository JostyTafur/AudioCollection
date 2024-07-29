import { Component } from '@angular/core';
import { AudioFormComponent } from '../../components/audio-form/audio-form.component';
import { AudioRecordComponent } from '../../components/audio-record/audio-record.component';
import { Subject } from 'rxjs';
import { ComponentsModule } from '../../components/components.module';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  
}

import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, FormInputModule, ModalRef } from 'zigzag';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'flare-profile-kudos-modal',
  template: `<div class="p-4">
    <header class="mb-6">
      <h1 class="text-lg font-medium">Give Kudos</h1>
    </header>
    <form>
      <div class="flex flex-col">
        <textarea
          zzInput
          variant="fill"
          [formControl]="kudos"
          class="rounded-md border border-slate-200 bg-slate-100 p-2"
          name="kudos"
          placeholder="Write something nice..."
          rows="4"
        ></textarea>
      </div>
      <footer class="mt-6 flex items-center justify-start gap-2">
        <button
          zzButton
          variant="primary"
          (click)="submit()"
          [disabled]="this.kudos.invalid"
          type="submit"
        >
          Send
        </button>
        <button zzButton type="button">Close</button>
      </footer>
    </form>
  </div>`,
})
export class ProfileKudosModalComponent {
  kudos = new FormControl(['']);

  constructor(private readonly modalRef: ModalRef) {}

  submit() {
    this.modalRef.close(this.kudos.value);
  }
}

@NgModule({
  declarations: [ProfileKudosModalComponent],
  imports: [CommonModule, ButtonModule, FormInputModule, ReactiveFormsModule],
  exports: [ProfileKudosModalComponent],
})
export class ProfileKudosModalModule {}

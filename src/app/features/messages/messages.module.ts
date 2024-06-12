import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ListProfilesComponent } from './list-profiles/list-profiles.component';
import { WriteConversationComponent } from './conversation/write-conversation/write-conversation.component';
import { ProfileComponent } from './list-profiles/profile/profile.component';
import { SearchProfileComponent } from './list-profiles/search-profile/search-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MessagesComponent,
    ConversationComponent,
    ListProfilesComponent,
    WriteConversationComponent,
    ProfileComponent,
    SearchProfileComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MessagesModule { }

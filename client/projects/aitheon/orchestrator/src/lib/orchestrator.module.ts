import { NgModule, Optional, ModuleWithProviders, SkipSelf } from '@angular/core';
import { ApiModule } from './rest/api.module';
import { Configuration } from './rest/configuration';

@NgModule({
  declarations: [
  ],
  imports: [
    ApiModule
  ],
  providers: [
  ],
  exports: [
    ApiModule
  ]
})
export class OrchestratorModule {
  public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
    return {
      ngModule: OrchestratorModule,
      providers: [
        { provide: Configuration, useFactory: configurationFactory }
      ]
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: OrchestratorModule) {
    if (parentModule) {
      throw new Error('OrchestratorModule is already loaded. Import in your base AppModule only.');
    }
  }
}
// dist

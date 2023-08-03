import { Controller, Get, Query } from '@nestjs/common';
import { State, City } from 'country-state-city';
@Controller('location')
export class LocationController {
  private readonly countryCode = 'IN';

  @Get()
  getCountryCode(): string {
    return this.countryCode;
  }

  @Get('states')
  getStates(): Array<{ name: string; code: string }> {
    return State.getStatesOfCountry(this.countryCode).map((e) => {
      return { name: e.name, code: e.isoCode };
    });
  }

  @Get('cities')
  getCities(@Query('state') state: string) {
    return City.getCitiesOfState(this.countryCode, state).map((e) => e.name);
  }
}

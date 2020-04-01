import { resolve } from 'path';
import { mapTripToRouteAndService } from '~/lib/tasks/builders/trips';

describe('builders/trips#mapTripToRouteAndService', () => {
  it('should returning map data of the `trip_id -> { route_id, service_id }`', async () => {
    const subjects = await mapTripToRouteAndService(resolve(__dirname, 'fixtures'));
    Object.values(subjects).forEach((subject) => {
      expect(subject).toHaveProperty('route_id');
      expect(subject).toHaveProperty('service_id');
    });
  });
});

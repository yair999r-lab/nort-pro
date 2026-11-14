import {
  ports,
  ships,
  routes,
  routeStops,
  shipments,
  portDistances,
} from './shippingMockData';

export function validateShippingMockData(): string[] {
  const errors: string[] = [];

  const portIds = new Set(ports.map((port) => port.id));
  const shipIds = new Set(ships.map((ship) => ship.id));
  const routeIds = new Set(routes.map((route) => route.id));

  // בדיקת מזהים כפולים
  if (portIds.size !== ports.length) {
    errors.push('נמצאו מזהי נמלים כפולים');
  }

  if (shipIds.size !== ships.length) {
    errors.push('נמצאו מזהי ספינות כפולים');

    if (routeIds.size !== routes.length) {
      errors.push('נמצאו מזהי מסלולים כפולים');
    }
  }
  const assignedRouteIds = ships.map((ship) => ship.routeId);

  if (new Set(assignedRouteIds).size !== assignedRouteIds.length) {
    errors.push('יותר מספינה אחת משויכת לאותו מסלול');
  }

  routes.forEach((route) => {
    if (!assignedRouteIds.includes(route.id)) {
      errors.push(`${route.name}: לא משויכת למסלול ספינה`);
    }
  });

  // בדיקת הספינות
  ships.forEach((ship) => {
    if (!portIds.has(ship.homePortId)) {
      errors.push(`${ship.name}: נמל הבית לא קיים`);
    }
    if (!routeIds.has(ship.routeId)) {
      errors.push(`${ship.name}: המסלול המשויך לספינה לא קיים`);
    } else {
      const assignedRoute = routes.find((route) => route.id === ship.routeId);

      if (assignedRoute && assignedRoute.startPortId !== ship.homePortId) {
        errors.push(`${ship.name}: נמל הבית אינו תואם לנמל ההתחלה של המסלול`);
      }
    }

    if (!portIds.has(ship.currentPortId)) {
      errors.push(`${ship.name}: הנמל הנוכחי לא קיים`);
    }

    if (ship.capacityKg <= 0 || ship.speedKnots <= 0) {
      errors.push(`${ship.name}: נתוני הספינה אינם תקינים`);
    }
  });

  // בדיקת המסלולים
  routes.forEach((route) => {
    const stops = routeStops
      .filter((stop) => stop.routeId === route.id)
      .sort((a, b) => a.stopOrder - b.stopOrder);

    if (stops.length !== 6) {
      errors.push(`${route.name}: המסלול חייב להכיל 6 תחנות`);
      return;
    }

    stops.forEach((stop, index) => {
      const nextStop = stops[(index + 1) % stops.length];

      const distanceExists = portDistances.some(
        (distance) =>
          distance.fromPortId === stop.portId &&
          distance.toPortId === nextStop.portId,
      );

      if (!distanceExists) {
        errors.push(
          `${route.name}: חסר מרחק בין ${stop.portId} ל-${nextStop.portId}`,
        );
      }
    });

    const expectedOrder = [1, 2, 3, 4, 5, 6];

    const actualOrder = stops.map((stop) => stop.stopOrder);

    if (!expectedOrder.every((order, index) => order === actualOrder[index])) {
      errors.push(`${route.name}: סדר התחנות אינו תקין`);
    }

    if (stops[0].portId !== route.startPortId) {
      errors.push(`${route.name}: נמל ההתחלה אינו תואם`);
    }

    if (route.endPortId !== route.startPortId) {
      errors.push(`${route.name}: המסלול אינו מעגלי`);
    }

    const uniqueStops = new Set(stops.map((stop) => stop.portId));

    if (uniqueStops.size !== stops.length) {
      errors.push(`${route.name}: קיימת תחנה כפולה`);
    }

    stops.forEach((stop) => {
      if (!portIds.has(stop.portId)) {
        errors.push(`${route.name}: נמצאה תחנה ללא נמל קיים`);
      }
    });
  });

  // בדיקת המשלוחים
  shipments.forEach((shipment) => {
    if (!portIds.has(shipment.originPortId)) {
      errors.push(`${shipment.id}: נמל המוצא לא קיים`);
    }

    if (!portIds.has(shipment.destinationPortId)) {
      errors.push(`${shipment.id}: נמל היעד לא קיים`);
    }

    if (shipment.originPortId === shipment.destinationPortId) {
      errors.push(`${shipment.id}: המוצא והיעד זהים`);
    }

    if (shipment.weightKg <= 0) {
      errors.push(`${shipment.id}: משקל לא תקין`);
    }

    if (Number.isNaN(Date.parse(shipment.requiredArrival))) {
      errors.push(`${shipment.id}: תאריך אספקה לא תקין`);
    }
  });

  const distanceIds = new Set(portDistances.map((distance) => distance.id));

  if (distanceIds.size !== portDistances.length) {
    errors.push('נמצאו מזהי מרחקים כפולים');
  }

  portDistances.forEach((distance) => {
    if (!portIds.has(distance.fromPortId)) {
      errors.push(`${distance.id}: נמל המוצא לא קיים`);
    }

    if (!portIds.has(distance.toPortId)) {
      errors.push(`${distance.id}: נמל היעד לא קיים`);
    }

    if (distance.fromPortId === distance.toPortId) {
      errors.push(`${distance.id}: נמלי המוצא והיעד זהים`);
    }

    if (!Number.isFinite(distance.distanceNm) || distance.distanceNm <= 0) {
      errors.push(`${distance.id}: המרחק אינו תקין`);
    }
  });

  return errors;
}

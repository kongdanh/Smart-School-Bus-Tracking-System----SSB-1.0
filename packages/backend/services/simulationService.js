const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const notificationService = require('./notificationService');

// Store active simulations: { scheduleId: { intervalId, currentIndex, path, stops, students } }
const activeSimulations = new Map();

const UPDATE_INTERVAL = 2000; // 2 seconds
const STEP_SIZE = 5; // Move 5 points per tick (speed)

exports.startSimulation = async (scheduleId) => {
    if (activeSimulations.has(scheduleId)) {
        console.log(`Simulation for schedule ${scheduleId} already running.`);
        return;
    }

    console.log(`Starting simulation for schedule ${scheduleId}...`);

    try {
        // 1. Fetch Schedule Data
        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: parseInt(scheduleId) },
            include: {
                tuyenduong: {
                    include: {
                        tuyenduong_diemdung: {
                            include: { diemdung: true },
                            orderBy: { thuTu: 'asc' }
                        }
                    }
                },
                studentTrips: {
                    include: {
                        hocsinh: {
                            include: { phuhuynh: true }
                        }
                    }
                }
            }
        });

        if (!schedule || !schedule.tuyenduong) {
            console.error("Schedule or Route not found");
            return;
        }

        // 2. Get Waypoints from Stops
        const stops = schedule.tuyenduong.tuyenduong_diemdung.map(td => ({
            lat: td.diemdung.vido,
            lng: td.diemdung.kinhdo,
            name: td.diemdung.tenDiemDung,
            id: td.diemdung.diemDungId
        }));

        if (stops.length < 2) {
            console.error("Not enough stops to simulate path");
            return;
        }

        // 3. Get OSRM Path
        let path = await getOSRMPath(stops);
        if (!path || path.length === 0) {
            console.error("Could not fetch OSRM path, using straight lines fallback");
            // Fallback: Create intermediate points between stops for smoother animation
            path = [];
            for (let i = 0; i < stops.length - 1; i++) {
                const start = stops[i];
                const end = stops[i + 1];
                // Add start point
                path.push(start);
                // Add 10 intermediate points
                for (let j = 1; j <= 10; j++) {
                    path.push({
                        lat: start.lat + (end.lat - start.lat) * (j / 11),
                        lng: start.lng + (end.lng - start.lng) * (j / 11)
                    });
                }
            }
            // Add last point
            path.push(stops[stops.length - 1]);
        }

        // 4. Notify Parents: Trip Started
        const students = schedule.studentTrips.map(st => st.hocsinh);
        notifyParents(students, "Bus Started", `The bus for route ${schedule.tuyenduong.tenTuyen} has started.`);

        // 5. Start Loop
        const simulationState = {
            intervalId: null,
            currentIndex: 0,
            path: path,
            stops: stops,
            students: students,
            notifiedStops: new Set() // Track stops we've already notified "Approaching"
        };

        simulationState.intervalId = setInterval(() => {
            runSimulationTick(scheduleId, simulationState);
        }, UPDATE_INTERVAL);

        activeSimulations.set(scheduleId, simulationState);

    } catch (error) {
        console.error("Start simulation error:", error);
    }
};

exports.stopSimulation = (scheduleId) => {
    if (activeSimulations.has(scheduleId)) {
        const sim = activeSimulations.get(scheduleId);
        clearInterval(sim.intervalId);
        activeSimulations.delete(scheduleId);
        console.log(`Simulation for schedule ${scheduleId} stopped.`);
    }
};

async function getOSRMPath(waypoints) {
    try {
        // OSRM expects lng,lat
        const coordString = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;

        const response = await axios.get(url);
        if (response.data.routes && response.data.routes.length > 0) {
            // OSRM returns [lng, lat]
            return response.data.routes[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
        }
    } catch (error) {
        console.error("OSRM Error:", error.message);
        // Fallback: Straight lines between stops
        return waypoints;
    }
    return [];
}

function runSimulationTick(scheduleId, state) {
    // 1. Move Bus
    state.currentIndex += STEP_SIZE;

    if (state.currentIndex >= state.path.length) {
        state.currentIndex = state.path.length - 1;
        // End of trip logic?
        // For now, just stop simulation
        console.log(`Trip ${scheduleId} finished simulation path.`);
        exports.stopSimulation(scheduleId);
        notifyParents(state.students, "Trip Ended", "The bus has arrived at the final destination.");
        return;
    }

    const currentLocation = state.path[state.currentIndex];

    // 2. Broadcast Location
    notificationService.broadcastToTrip(scheduleId, 'BUS_LOCATION_UPDATE', {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        scheduleId: scheduleId
    });

    // 2.1 Persist Location to DB (Optional but good for initial load)
    // We do this async and don't await to avoid blocking the loop
    updateBusLocationInDB(scheduleId, currentLocation.lat, currentLocation.lng).catch(err => console.error("DB Update Error:", err));

    // 3. Check Proximity to Stops
    state.stops.forEach(stop => {
        if (state.notifiedStops.has(stop.id)) return;

        const distance = getDistanceFromLatLonInKm(currentLocation.lat, currentLocation.lng, stop.lat, stop.lng);

        // If closer than 0.5 km (500m)
        if (distance < 0.5) {
            console.log(`Bus approaching stop: ${stop.name}`);
            state.notifiedStops.add(stop.id);

            // Notify parents whose children are at this stop (Logic needed to map student -> stop)
            // For now, notify all parents "Approaching [Stop Name]"
            // Or better: "Bus is approaching [Stop Name]"
            notifyParents(state.students, "Bus Approaching", `The bus is approaching ${stop.name}.`);
        }
    });
}

function notifyParents(students, title, message) {
    students.forEach(student => {
        if (student.phuhuynh && student.phuhuynh.userId) {
            notificationService.sendNotification(student.phuhuynh.userId, title, message, 'info');
        }
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

async function updateBusLocationInDB(scheduleId, lat, lng) {
    try {
        // Find bus ID from schedule
        const schedule = await prisma.lichtrinh.findUnique({
            where: { lichTrinhId: parseInt(scheduleId) },
            select: { xeBuytId: true }
        });

        if (schedule && schedule.xeBuytId) {
            await prisma.vitri.create({
                data: {
                    xeBuytId: schedule.xeBuytId,
                    vido: lat,
                    kinhdo: lng,
                    thoiGian: new Date()
                }
            });
        }
    } catch (error) {
        // Silent fail or log
    }
}

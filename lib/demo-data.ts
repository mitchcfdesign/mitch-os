import type { Project } from './types'

export const demoProject: Project = {
  id: 'madison-block',
  name: 'Madison Block',
  gc: 'Royal Construction',
  address: '418 E Madison St — Floors 1–5',
  description: 'Brick building conversion — 5 stories, apartment units + storefronts',
  updatedAt: '2026-05-04T07:30:00Z',

  crew: [
    { id: 'c1', name: 'Marcus Webb', initials: 'MW' },
    { id: 'c2', name: 'Devon Chase', initials: 'DC' },
    { id: 'c3', name: 'Ricky Torres', initials: 'RT' },
    { id: 'c4', name: 'Cole Bradshaw', initials: 'CB' },
    { id: 'c5', name: 'Jake Finney', initials: 'JF' },
    { id: 'c6', name: 'Sam Porter', initials: 'SP' },
    { id: 'c7', name: 'Tyler Marsh', initials: 'TM' },
    { id: 'c8', name: 'Austin Keene', initials: 'AK' },
  ],

  blockers: [
    {
      id: 'bl-ceiling-23',
      type: 'owner',
      description: 'Owner must confirm finished ceiling height on floors 2 and 3',
      owner: 'Building Owner (via GC)',
      affectedRoomIds: ['2a','2b','2c','2d','2e','2f','2g','2h','3a','3b','3c','3d','3e','3f','3g'],
      daysActive: 11,
      assumption: "8'6\" finished ceiling — 10' floor-to-floor, minus 5.5\" (2×6 joists), minus 12\" MEP clearance. Owner wants 9' but it is not achievable on these floors.",
    },
    {
      id: 'bl-concrete-4cd',
      type: 'trade',
      description: 'Concrete sub must repair slab in 4C and 4D before bearing wall plates can be set',
      owner: 'Concrete Sub (GC to schedule)',
      affectedRoomIds: ['4c', '4d'],
      daysActive: 4,
    },
    {
      id: 'bl-no-plans-f1',
      type: 'unknown',
      description: 'No construction documents received for floor 1 storefronts',
      owner: 'Architect / GC',
      affectedRoomIds: ['f1-a', 'f1-b', 'f1-c', 'f1-d', 'f1-entry'],
      daysActive: 21,
    },
    {
      id: 'bl-unknown-f5',
      type: 'unknown',
      description: 'Floor 5 scope not determined — awaiting design decision from owner',
      owner: 'Building Owner',
      affectedRoomIds: ['f5-hall', 'f5-kitchen', 'f5-restrooms'],
      daysActive: 21,
    },
  ],

  floors: [
    {
      number: 1,
      label: 'F1',
      use: 'Storefronts',
      rooms: [
        { id: 'f1-a', name: 'Storefront A', floor: 1, type: 'storefront', status: 'unknown', tasks: [], blockerIds: ['bl-no-plans-f1'], colSpan: 2 },
        { id: 'f1-b', name: 'Storefront B', floor: 1, type: 'storefront', status: 'unknown', tasks: [], blockerIds: ['bl-no-plans-f1'], colSpan: 1 },
        { id: 'f1-c', name: 'Storefront C', floor: 1, type: 'storefront', status: 'unknown', tasks: [], blockerIds: ['bl-no-plans-f1'], colSpan: 1 },
        { id: 'f1-d', name: 'Storefront D', floor: 1, type: 'storefront', status: 'unknown', tasks: [], blockerIds: ['bl-no-plans-f1'], colSpan: 2 },
        { id: 'f1-entry', name: 'Common Entry', floor: 1, type: 'common', status: 'unknown', tasks: [], blockerIds: ['bl-no-plans-f1'], colSpan: 2 },
      ],
    },
    {
      number: 2,
      label: 'F2',
      use: 'Apartments',
      rooms: [
        {
          id: '2a', name: 'Unit 2A', floor: 2, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true,
          status: 'partial', colSpan: 2,
          tasks: [
            { id: '2a-walls', description: 'Demising + exterior walls', status: 'complete', assignedTo: [], estimatedHours: 16 },
            { id: '2a-int', description: 'Interior partition walls', status: 'complete', assignedTo: [], estimatedHours: 8 },
            { id: '2a-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 10 },
          ],
          blockerIds: ['bl-ceiling-23'],
          notes: "Ceiling blocked on owner decision. Assuming 8'6\" finished. Floor slopes — will need to account for on ledger.",
        },
        { id: '2b', name: 'Unit 2B', floor: 2, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '2b-walls', description: 'Exterior + demising walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '2b-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2c', name: 'Unit 2C', floor: 2, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '2c-walls', description: 'Exterior + demising walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '2c-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2d', name: 'Unit 2D', floor: 2, type: 'unit', bedrooms: 2, bathrooms: 2, hasKitchen: true, status: 'partial', colSpan: 2, tasks: [{ id: '2d-walls', description: 'Exterior + demising walls', status: 'complete', assignedTo: [], estimatedHours: 18 }, { id: '2d-int', description: 'Interior partition walls', status: 'complete', assignedTo: [], estimatedHours: 10 }, { id: '2d-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 12 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2e', name: 'Unit 2E', floor: 2, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '2e-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '2e-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2f', name: 'Unit 2F', floor: 2, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '2f-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '2f-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2g', name: 'Unit 2G', floor: 2, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 2, tasks: [{ id: '2g-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 16 }, { id: '2g-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 10 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2h', name: 'Unit 2H', floor: 2, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '2h-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 10 }, { id: '2h-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '2-corr', name: 'Corridor', floor: 2, type: 'corridor', status: 'available', colSpan: 2, tasks: [{ id: '2cr-frame', description: 'Corridor wall framing', status: 'complete', assignedTo: [], estimatedHours: 8 }, { id: '2cr-fire', description: 'Fire blocking in corridor bays', status: 'not-started', assignedTo: [], estimatedHours: 4 }], blockerIds: [] },
        { id: '2-stair', name: 'East Stairwell', floor: 2, type: 'stairwell', status: 'complete', colSpan: 1, tasks: [{ id: '2s-frame', description: 'Stairwell framing', status: 'complete', assignedTo: [], estimatedHours: 12 }], blockerIds: [] },
      ],
    },
    {
      number: 3,
      label: 'F3',
      use: 'Apartments',
      rooms: [
        { id: '3a', name: 'Unit 3A', floor: 3, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 2, tasks: [{ id: '3a-walls', description: 'Exterior + demising walls', status: 'complete', assignedTo: [], estimatedHours: 16 }, { id: '3a-int', description: 'Interior partition walls', status: 'complete', assignedTo: [], estimatedHours: 8 }, { id: '3a-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 10 }], blockerIds: ['bl-ceiling-23'], notes: "Same ceiling constraint as F2. 8'6\" assumed." },
        { id: '3b', name: 'Unit 3B', floor: 3, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '3b-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '3b-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3c', name: 'Unit 3C', floor: 3, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '3c-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '3c-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3d', name: 'Unit 3D', floor: 3, type: 'unit', bedrooms: 2, bathrooms: 2, hasKitchen: true, status: 'partial', colSpan: 2, tasks: [{ id: '3d-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 18 }, { id: '3d-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 12 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3e', name: 'Unit 3E', floor: 3, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '3e-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '3e-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3f', name: 'Unit 3F', floor: 3, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 1, tasks: [{ id: '3f-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '3f-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3g', name: 'Unit 3G', floor: 3, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true, status: 'partial', colSpan: 2, tasks: [{ id: '3g-walls', description: 'Walls', status: 'complete', assignedTo: [], estimatedHours: 16 }, { id: '3g-ceil', description: 'Ceiling', status: 'not-started', assignedTo: [], estimatedHours: 10 }], blockerIds: ['bl-ceiling-23'] },
        { id: '3-corr', name: 'Corridor', floor: 3, type: 'corridor', status: 'available', colSpan: 2, tasks: [{ id: '3cr-frame', description: 'Corridor wall framing', status: 'complete', assignedTo: [], estimatedHours: 8 }, { id: '3cr-fire', description: 'Fire blocking in corridor bays', status: 'not-started', assignedTo: [], estimatedHours: 4 }], blockerIds: [] },
        { id: '3-stair', name: 'East Stairwell', floor: 3, type: 'stairwell', status: 'complete', colSpan: 1, tasks: [{ id: '3s-frame', description: 'Stairwell framing', status: 'complete', assignedTo: [], estimatedHours: 12 }], blockerIds: [] },
      ],
    },
    {
      number: 4,
      label: 'F4',
      use: 'Apartments — Active',
      rooms: [
        { id: '4a', name: 'Unit 4A', floor: 4, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true, status: 'in-progress', colSpan: 2, tasks: [{ id: '4a-walls', description: 'Demising + exterior walls', status: 'complete', assignedTo: ['c1','c2'], estimatedHours: 16 }, { id: '4a-int', description: 'Interior partition walls', status: 'complete', assignedTo: ['c1','c2'], estimatedHours: 8 }, { id: '4a-ceil', description: 'Ceiling joists + ledger board', status: 'in-progress', assignedTo: ['c1','c2'], estimatedHours: 10 }, { id: '4a-punch', description: 'Punch-out — backing, blocking, misc', status: 'not-started', assignedTo: [], estimatedHours: 6 }], blockerIds: [], notes: "9'1-1/8\" finished ceiling. Floor slopes ~3/4\" E to W — account for on ledger board. Marcus + Devon currently on ceiling." },
        { id: '4b', name: 'Unit 4B', floor: 4, type: 'unit', bedrooms: 2, bathrooms: 2, hasKitchen: true, status: 'in-progress', colSpan: 2, tasks: [{ id: '4b-walls', description: 'Demising + exterior walls', status: 'complete', assignedTo: [], estimatedHours: 18 }, { id: '4b-ceil', description: 'Ceiling joists + ledger board', status: 'complete', assignedTo: ['c1','c2'], estimatedHours: 12 }, { id: '4b-int', description: 'Interior partitions (post-ceiling)', status: 'in-progress', assignedTo: ['c3','c4'], estimatedHours: 14 }, { id: '4b-punch', description: 'Punch-out', status: 'not-started', assignedTo: [], estimatedHours: 6 }], blockerIds: [], notes: 'Ceiling complete. Ricky + Cole building interior walls behind ceiling crew.' },
        { id: '4c', name: 'Unit 4C', floor: 4, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'blocked', colSpan: 1, tasks: [{ id: '4c-slab', description: 'Concrete slab repair (sub)', status: 'not-started', assignedTo: [], estimatedHours: 0 }, { id: '4c-walls', description: 'Bearing wall plates + exterior walls', status: 'not-started', assignedTo: [], estimatedHours: 10 }, { id: '4c-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 8 }, { id: '4c-int', description: 'Interior partitions', status: 'not-started', assignedTo: [], estimatedHours: 6 }], blockerIds: ['bl-concrete-4cd'], notes: "Cannot set any plates. ~4'×3' hole in slab near south wall." },
        { id: '4d', name: 'Unit 4D', floor: 4, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'blocked', colSpan: 1, tasks: [{ id: '4d-slab', description: 'Concrete slab repair (sub)', status: 'not-started', assignedTo: [], estimatedHours: 0 }, { id: '4d-walls', description: 'Bearing wall + exterior walls', status: 'not-started', assignedTo: [], estimatedHours: 10 }, { id: '4d-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 8 }], blockerIds: ['bl-concrete-4cd'] },
        { id: '4e', name: 'Unit 4E', floor: 4, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'complete', colSpan: 1, tasks: [{ id: '4e-walls', description: 'All walls', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '4e-ceil', description: 'Ceiling framing', status: 'complete', assignedTo: [], estimatedHours: 8 }, { id: '4e-int', description: 'Interior partitions', status: 'complete', assignedTo: [], estimatedHours: 6 }, { id: '4e-punch', description: 'Punch-out', status: 'complete', assignedTo: [], estimatedHours: 4 }], blockerIds: [] },
        { id: '4f', name: 'Unit 4F', floor: 4, type: 'unit', bedrooms: 2, bathrooms: 1, hasKitchen: true, status: 'available', colSpan: 2, tasks: [{ id: '4f-walls', description: 'Demising + exterior walls', status: 'complete', assignedTo: [], estimatedHours: 16 }, { id: '4f-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 10 }, { id: '4f-int', description: 'Interior partitions', status: 'not-started', assignedTo: [], estimatedHours: 8 }, { id: '4f-punch', description: 'Punch-out', status: 'not-started', assignedTo: [], estimatedHours: 5 }], blockerIds: [], notes: 'Next ceiling after 4A. Marcus + Devon queued here Wed.' },
        { id: '4g', name: 'Unit 4G', floor: 4, type: 'unit', bedrooms: 1, bathrooms: 1, hasKitchen: true, status: 'available', colSpan: 1, tasks: [{ id: '4g-walls', description: 'Demising walls', status: 'complete', assignedTo: [], estimatedHours: 10 }, { id: '4g-ceil', description: 'Ceiling joists + ledger board', status: 'not-started', assignedTo: [], estimatedHours: 8 }, { id: '4g-int', description: 'Interior partitions', status: 'not-started', assignedTo: [], estimatedHours: 6 }], blockerIds: [] },
        { id: '4-corr', name: 'North Corridor', floor: 4, type: 'corridor', status: 'available', colSpan: 2, tasks: [{ id: '4cr-frame', description: 'Corridor wall framing', status: 'complete', assignedTo: [], estimatedHours: 8 }, { id: '4cr-fire', description: 'Fire blocking in corridor bays', status: 'not-started', assignedTo: [], estimatedHours: 4 }, { id: '4cr-back', description: 'Backing + blocking for hardware', status: 'not-started', assignedTo: [], estimatedHours: 3 }], blockerIds: [], notes: 'IBC requires fire blocking every 10 LF on stud bays adjacent to rated corridor.' },
        { id: '4-stair', name: 'East Stairwell', floor: 4, type: 'stairwell', status: 'partial', colSpan: 1, tasks: [{ id: '4s-frame', description: 'Stairwell framing', status: 'complete', assignedTo: [], estimatedHours: 12 }, { id: '4s-fire', description: 'Fire blocking — penetrations', status: 'not-started', assignedTo: [], estimatedHours: 4 }], blockerIds: [] },
      ],
    },
    {
      number: 5,
      label: 'F5',
      use: 'Public Space',
      rooms: [
        { id: 'f5-hall', name: 'Main Hall', floor: 5, type: 'common', status: 'unknown', colSpan: 2, tasks: [], blockerIds: ['bl-unknown-f5'], notes: 'Approx. size of a single apartment unit. Scope TBD.' },
        { id: 'f5-kitchen', name: 'Kitchenette / Bar', floor: 5, type: 'common', status: 'unknown', colSpan: 1, tasks: [], blockerIds: ['bl-unknown-f5'] },
        { id: 'f5-restrooms', name: 'Restrooms', floor: 5, type: 'common', status: 'unknown', colSpan: 1, tasks: [], blockerIds: ['bl-unknown-f5'] },
      ],
    },
  ],

  weeklyPlan: {
    weekOf: '2026-05-04',
    crewSize: 8,
    gapWarning: 'Units 4C + 4D are blocked (concrete repair). This creates a mid-week gap for up to 4 carpenters. Push GC for concrete sub schedule by Tuesday or redirect to punch-out on F3 corridor.',
    tasks: [
      { id: 'wp-1', carpenterIds: ['c1','c2'], roomId: '4a', description: 'Complete ceiling joists + ledger board in 4A', days: ['Mon','Tue'], status: 'in-progress', estimatedHours: 10 },
      { id: 'wp-2', carpenterIds: ['c3','c4'], roomId: '4b', description: 'Complete interior partition walls in 4B', days: ['Mon','Tue','Wed'], status: 'in-progress', estimatedHours: 14 },
      { id: 'wp-3', carpenterIds: ['c1','c2'], roomId: '4f', description: 'Begin ceiling joists + ledger board in 4F', days: ['Wed','Thu','Fri'], status: 'not-started', estimatedHours: 10 },
      { id: 'wp-4', carpenterIds: ['c3','c4'], roomId: '4g', description: 'Begin ceiling framing in 4G', days: ['Thu','Fri'], status: 'not-started', estimatedHours: 8 },
      { id: 'wp-5', carpenterIds: ['c5','c6'], roomId: '4-corr', description: 'Fire blocking + backing in North Corridor', days: ['Mon','Tue','Wed','Thu'], status: 'not-started', estimatedHours: 7 },
      { id: 'wp-6', carpenterIds: ['c7','c8'], roomId: '4-stair', description: 'Fire blocking at stairwell penetrations', days: ['Mon','Tue'], status: 'not-started', estimatedHours: 4 },
      { id: 'wp-7', carpenterIds: ['c5','c6','c7','c8'], roomId: '4b', description: 'Full crew punch-out on 4B once partitions complete', days: ['Fri'], status: 'not-started', estimatedHours: 12 },
    ],
  },

  materials: [
    { id: 'm1', name: "2×6 × 16'", unit: 'pcs', onHand: 148, weeklyNeed: 200, lowThreshold: 80, category: 'lumber' },
    { id: 'm2', name: "2×6 × 12'", unit: 'pcs', onHand: 24, weeklyNeed: 60, lowThreshold: 30, category: 'lumber' },
    { id: 'm3', name: "2×4 × 8'", unit: 'pcs', onHand: 312, weeklyNeed: 120, lowThreshold: 60, category: 'lumber' },
    { id: 'm4', name: "2×4 × 12'", unit: 'pcs', onHand: 64, weeklyNeed: 40, lowThreshold: 20, category: 'lumber' },
    { id: 'm5', name: '2×6 Joist Hangers', unit: 'pcs', onHand: 84, weeklyNeed: 100, lowThreshold: 40, category: 'hardware' },
    { id: 'm6', name: 'H2.5A Hurricane Ties', unit: 'pcs', onHand: 0, weeklyNeed: 0, lowThreshold: 0, category: 'hardware' },
    { id: 'm7', name: '16d Sinker Nails', unit: 'lbs', onHand: 22, weeklyNeed: 15, lowThreshold: 10, category: 'fasteners' },
    { id: 'm8', name: "8d × 1.5\" Nails", unit: 'lbs', onHand: 8, weeklyNeed: 12, lowThreshold: 10, category: 'fasteners' },
    { id: 'm9', name: "Sill Seal 3.5\"", unit: 'rolls', onHand: 3, weeklyNeed: 1, lowThreshold: 1, category: 'consumables' },
    { id: 'm10', name: 'Construction Screws 3"', unit: 'lbs', onHand: 6, weeklyNeed: 4, lowThreshold: 2, category: 'fasteners' },
  ],
}

export const allProjects: Project[] = [
  demoProject,
  {
    id: 'river-valley-office',
    name: 'River Valley Office',
    gc: 'Royal Construction',
    address: '220 River Valley Dr — Suite 100–400',
    description: 'Office buildout — 2 floors, tenant improvement',
    updatedAt: '2026-04-28T14:00:00Z',
    crew: [],
    blockers: [
      { id: 'rv-bl-1', type: 'inspection', description: 'Framing inspection required before sheathing on floor 1', owner: 'City Inspector', affectedRoomIds: ['rv-suite-100','rv-suite-200'], daysActive: 2 },
    ],
    floors: [
      {
        number: 1, label: 'F1', use: 'Office Suites',
        rooms: [
          { id: 'rv-suite-100', name: 'Suite 100', floor: 1, type: 'unit', status: 'partial', colSpan: 2, tasks: [{ id: 'rv-100-walls', description: 'Partition walls', status: 'complete', assignedTo: [], estimatedHours: 24 }, { id: 'rv-100-inspect', description: 'Framing inspection', status: 'not-started', assignedTo: [], estimatedHours: 0 }], blockerIds: ['rv-bl-1'] },
          { id: 'rv-suite-200', name: 'Suite 200', floor: 1, type: 'unit', status: 'blocked', colSpan: 2, tasks: [{ id: 'rv-200-walls', description: 'Partition walls', status: 'not-started', assignedTo: [], estimatedHours: 20 }], blockerIds: ['rv-bl-1'] },
          { id: 'rv-lobby', name: 'Lobby', floor: 1, type: 'common', status: 'complete', colSpan: 2, tasks: [{ id: 'rv-lob-walls', description: 'Lobby framing', status: 'complete', assignedTo: [], estimatedHours: 16 }], blockerIds: [] },
        ],
      },
      {
        number: 2, label: 'F2', use: 'Office Suites',
        rooms: [
          { id: 'rv-suite-300', name: 'Suite 300', floor: 2, type: 'unit', status: 'available', colSpan: 2, tasks: [{ id: 'rv-300-walls', description: 'Partition walls', status: 'not-started', assignedTo: [], estimatedHours: 20 }], blockerIds: [] },
          { id: 'rv-suite-400', name: 'Suite 400', floor: 2, type: 'unit', status: 'available', colSpan: 2, tasks: [{ id: 'rv-400-walls', description: 'Partition walls', status: 'not-started', assignedTo: [], estimatedHours: 18 }], blockerIds: [] },
        ],
      },
    ],
    weeklyPlan: { weekOf: '2026-04-28', crewSize: 4, tasks: [], gapWarning: undefined },
    materials: [],
  },
]

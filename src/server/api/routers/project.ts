import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.name,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
  }),
});

// import { z } from "zod";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

// export const projectRouter = createTRPCRouter({
//   createProject: protectedProcedure
//     .input(
//       z.object({
//         name: z.string(),
//         githubUrl: z.string(),
//         githubToken: z.string().optional(),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const userId = ctx.user.userId!;
//       console.log(`Attempting to create project for user with id: ${userId}`);

//       // Ensure the user exists
//       const user = await ctx.db.user.findUnique({
//         where: { id: userId },
//       });

//       if (!user) {
//         console.error(`User with id ${userId} does not exist`);
//         throw new Error(`User with id ${userId} does not exist`);
//       }

//       // Create the project
//       const project = await ctx.db.project.create({
//         data: {
//           githubUrl: input.githubUrl,
//           name: input.name,
//           userToProjects: {
//             create: {
//               userId: userId,
//             },
//           },
//         },
//       });

//       return project;
//     }),
// });

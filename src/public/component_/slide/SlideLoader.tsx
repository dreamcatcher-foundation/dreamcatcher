import type { ReactNode } from "react";
import type { PageProps } from "@component/Page";
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { createMachine as Machine } from "xstate";
import { useState } from "react";


"use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Badge } from "@/components/ui/badge"
import { motion, useInView, easeOut } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Plus,
  BarChart3,
  FileText,
  Settings,
  ArrowRight,
  Target,
} from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../ui/button"
import { Progress } from "@radix-ui/react-progress"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: easeOut,
    },
  },
}

// Animated counter component
function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function PrivateHeader() {
  const stats = [
    {
      title: "Total Revenue",
      value: 45230,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Users",
      value: 2340,
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Conversion Rate",
      value: 12.8,
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Projects",
      value: 28,
      change: "+4",
      icon: Activity,
      color: "text-orange-600",
    },
  ]

  const quickActions = [
    { title: "Create Project", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
    { title: "View Analytics", icon: BarChart3, color: "bg-green-600 hover:bg-green-700" },
    { title: "Generate Report", icon: FileText, color: "bg-purple-600 hover:bg-purple-700" },
    { title: "Settings", icon: Settings, color: "bg-gray-600 hover:bg-gray-700" },
  ]

  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-2"
            >
              <Badge variant="secondary" className="text-xs">
                Welcome back
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              Good morning, John! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-2 text-lg text-muted-foreground max-w-2xl"
            >
              Here's what's happening with your business today. You're doing great!
            </motion.p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div key={stat.title} variants={cardVariants} whileHover="hover">
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stat.title === "Conversion Rate" ? (
                        <>
                          <AnimatedCounter end={stat.value} duration={1.5} />%
                        </>
                      ) : stat.title === "Total Revenue" ? (
                        <>
                          $<AnimatedCounter end={stat.value} duration={2} />
                        </>
                      ) : (
                        <AnimatedCounter end={stat.value} duration={1.5} />
                      )}
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`text-xs ${stat.color} flex items-center gap-1`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.change} from last month
                    </motion.p>
                  </CardContent>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Monthly Goal Progress
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">You're 78% towards your monthly target</p>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    22 days left
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>$35,200 / $45,000</span>
                    <span className="text-blue-600 font-medium">78%</span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <Progress value={78} className="h-2" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Get things done faster</p>
              </div>
              <Button variant="outline" className="group bg-transparent">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <motion.div variants={containerVariants} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <motion.div key={action.title} variants={cardVariants} whileHover="hover" whileTap={{ scale: 0.98 }}>
                  <Button className={`w-full h-auto p-4 ${action.color} text-white flex flex-col items-center gap-2`}>
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
